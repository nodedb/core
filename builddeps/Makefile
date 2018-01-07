linux: rpm-build deb-build

deb-build:
	electron-installer-debian --src ./build/nodedb-linux-x64 --dest ./dist/ --arch x86_64
.PHONY: deb-build

rpm-build:
	electron-installer-redhat --src ./build/nodedb-linux-x64 --dest ./dist/ --arch x86_64
.PHONY: rpm-build
