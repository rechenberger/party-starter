import { BRAND } from '@/lib/starter.config'
import { readFile, writeFile } from 'fs/promises'
import { kebabCase } from 'lodash-es'
import path from 'path'

const setPackageJsonName = async () => {
  const packageName = kebabCase(BRAND.name)
  const packageJsonPath = path.join(process.cwd(), 'package.json')
  const packageJson = await readFile(packageJsonPath, 'utf-8')
  const parsedPackageJson = JSON.parse(packageJson)
  parsedPackageJson.name = packageName
  await writeFile(packageJsonPath, JSON.stringify(parsedPackageJson, null, 2))
}

const main = async () => {
  await setPackageJsonName()
}

main()
