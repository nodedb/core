linux: rpm-build deb-build

deb-build:
	electron-installer-debian --src ./build/nodedb-linux-x64 --dest ./dist/ --arch x86_64 --config ./builddeps/linux-config.json
.PHONY: deb-build

rpm-build:
	electron-installer-redhat --src ./build/nodedb-linux-x64 --dest ./dist/ --arch x86_64 --config ./builddeps/linux-config.json
.PHONY: rpm-build
