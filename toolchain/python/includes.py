from os.path import join, basename, isfile, getmtime, normpath, splitext, dirname, relpath
import glob
import json
from make_config import make_config
from utils import move_file, copy_file
import os

from hash_storage import build_storage as storage


params_list = {
	"allowJs": False,
	"allowUnusedLabels": False,
	"alwaysStrict":	 False,
	"assumeChangesOnlyAffectDirectDependencies": False,
	"checkJs": False,
	"declaration": False,
	"diagnostics": False,
	"disableSizeLimit":	False,
	"downlevelIteration": False,
	"emitDeclarationOnly": False,
	"experimentalDecorators": False,
	"extendedDiagnostics": False,
	"importHelpers": False,
	"listEmittedFiles":	False,
	"listFiles": False,
	"locale": "en",
	"noEmit": False,
	"noEmitHelpers": False,
	"noEmitOnError": False,
	"noErrorTruncation": False,
	"noFallthroughCasesInSwitch": False,
	"noLib": False,
	"noResolve": False,
	"noStrictGenericChecks": False,
	"noUnusedLocals": False,
	"noUnusedParameters": False,
	"preserveConstEnums": False,
	"preserveSymlinks":	False,
	"pretty": True,
	"removeComments": False,
	"showConfig": False,
	"skipLibCheck": False,
	"sourceMap": False,
	"strict": False,
	"tsBuildInfoFile": 	".tsbuildinfo"
}

temp_directory = make_config.get_path("toolchain/build/project/sources")


class Includes:
	def __init__(self, directory):
		self.file = join(directory, ".includes")
		self.directory = directory

		self.include = []
		self.exclude = []
		self.params = {}

	def read(self):
		with open(self.file, encoding="utf-8") as includes:
			for line in includes:
				line = line.strip()
				self.decode_line(line)

	def decode_line(self, line):
		if line.startswith("#"):  # comment or parameter
			pair = [item.strip() for item in line[1:].strip().split(":")]
			key = pair[0]

			if key in params_list:
				default = params_list[key]

				if len(pair) > 1:
					v = pair[1].lower()
					self.params[key] = v == "true" if v in ["true", "false"] else v
				else:
					self.params[key] = True if isinstance(default, bool) else default

		elif len(line) < 1 or line.startswith("//"):
			return

		elif line.startswith("!"):
			line = line[1:].strip()
			search_path = (join(self.directory, line[:-2], ".") + "/**/*") if line.endswith("/.") else join(self.directory, line)
			for file in glob.glob(search_path, recursive=True):
				file = normpath(file)
				if file not in self.include:
					self.exclude.append(relpath(file, self.directory).replace("\\", "/"))

		else:
			search_path = (join(self.directory, line[:-2], ".") + "/**/*") if line.endswith("/.") else join(self.directory, line)
			for file in glob.glob(search_path, recursive=True):
				file = normpath(file)
				if file not in self.include:
					self.include.append(relpath(file, self.directory).replace("\\", "/"))

	def create(self):
		with open(self.file, "w") as includes:
			params = ["# " + key + ((": " + str(self.params[key])).lower() if not self.params[key] else "") + '\n' for key in self.params]
			files = [file + '\n' for file in self.include]

			includes.write("# autogenerated includes")
			includes.write('\n\n')
			includes.writelines(params)
			includes.write('\n')
			includes.writelines(files)

	@staticmethod
	def create_from_directory(directory):
		includes = Includes(directory)
		includes.files = [normpath(relpath(file, directory)) for file in glob.glob(f"{directory}/**/*", recursive=True)]
		includes.params = {}
		includes.create()

		return includes

	@staticmethod
	def create_from_tsconfig(directory):
		with open(join(directory, "tsconfig.json")) as tsconfig:
			config = json.load(tsconfig)

			params = config["compilerOptions"]
			include = config["include"]
			exclude = config["exclude"]

			if "target" in params:
				del params["target"]
			if "lib" in params:
				del params["lib"]
			if "outFile" in params:
				del params["outFile"]

		includes = Includes(directory)
		includes.include = include
		includes.exclude = exclude
		includes.params = params
		includes.create()

		return includes

	@staticmethod
	def invalidate(directory):
		if not isfile(join(directory, ".includes")):
			tsconfig_path = join(directory, "tsconfig.json")
			if isfile(tsconfig_path):
				includes = Includes.create_from_tsconfig(directory)
			else:
				includes = Includes.create_from_directory(directory)
		else:
			includes = Includes(directory)
		includes.read()

		return includes

	def build(self, target_path):
		temp_path = join(temp_directory, basename(target_path))

		result = 0
		self.create_tsconfig(temp_path)
		if storage.is_path_changed(self.directory):
			import datetime

			print(f"building {basename(target_path)}")

			start_time = datetime.datetime.now()
			result = self.build_source(temp_path)
			end_time = datetime.datetime.now()
			diff = end_time - start_time

			print(f"completed {basename(target_path)} build in {round(diff.total_seconds(), 2)}s with result {result} - {'OK' if result == 0 else 'ERROR'}")
			if result != 0:
				return result
			storage.save()
		else:
			print(f"{basename(target_path)} is not changed")
		copy_file(temp_path, target_path)

		return result

	def get_tsconfig(self):
		return join(self.directory, "tsconfig.json")
		
	def create_tsconfig(self, temp_path: str):
		declarations = []
		declarations.extend(glob.glob(make_config.get_path(
			"toolchain/declarations/**/*.d.ts"), recursive=True))
		declarations.extend(glob.glob(make_config.get_path(
			"toolchain/build/project/declarations/**/*.d.ts"), recursive=True))
		filteredDeclarations = []
		for declaration in declarations:
			declaration = str(declaration)
			if temp_path.endswith("preloader.js"):
				print("checking " + declaration + " declaration for preloader")
				if declaration.endswith("preloader.d.ts") or declaration.endswith("android.d.ts") or declaration.endswith("android-declarations.d.ts"):
					filteredDeclarations.append(declaration)
					print("passed")
			elif not (declaration.endswith("preloader.d.ts") or declaration.endswith("AvaritiaAPI.d.ts")):
				filteredDeclarations.append(declaration)
		declarations = filteredDeclarations
		if temp_path.endswith("preloader.js"):
			print("declarations for preloader are " + str(declarations))

		template = {
			"compilerOptions": {
				"target": "ES5",
				"lib": ["ESNext"],
				"outFile": temp_path,
				"experimentalDecorators": True,
				"downlevelIteration": True,
				"allowJs": True
			},
			"exclude": [
				"**/node_modules/*",
				"dom",
				"webpack"
			] + self.exclude,
			"include": self.include,
		}

		if len(declarations) > 0:
			template["files"] = declarations

		for key, value in self.params.items():
			template["compilerOptions"][key] = value

		with open(self.get_tsconfig(), "w") as tsconfig:
			json.dump(template, tsconfig, indent="\t")

	def build_source(self, temp_path):
		result = os.system(f'tsc -p "{self.get_tsconfig()}" --noEmitOnError')

		declaration_path = f"{splitext(temp_path)[0]}.d.ts"
		if(isfile(declaration_path)):
			move_file(declaration_path, join(make_config.get_path("toolchain/build/project/declarations"), basename(declaration_path)))

		return result
