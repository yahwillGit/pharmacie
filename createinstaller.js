const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')

getInstallerConfig()
  .then(createWindowsInstaller)
  .catch((error) => {
    console.error(error.message || error)
    process.exit(1)
  })

function getInstallerConfig () {
  console.log('creating windows installer')
  const rootPath = path.join('./')
  const outPath = path.join(rootPath, '.')

  return Promise.resolve({
    appDirectory: path.join(outPath, './buildsep/PharmGuard-win32-ia32'),
    authors: 'Yahwill',
    noMsi: false,
    outputDirectory: path.join(outPath, 'windows-installer'),
    exe: 'PharmGuard.exe',
    setupExe: 'PharmGuard.exe'
  })
}
