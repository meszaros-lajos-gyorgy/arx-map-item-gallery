import { ArxMap, Entity, Light, Rotation, Settings, Texture, Vector3 } from 'arx-level-generator'
import { createPlaneMesh } from 'arx-level-generator/prefabs/mesh'
import { createLight } from 'arx-level-generator/tools'
import { applyTransformations } from 'arx-level-generator/utils'
import { MathUtils, Vector2 } from 'three'
import { fixInters } from '@/constants.js'

const settings = new Settings()
const map = new ArxMap()

map.config.offset = new Vector3(6000, 0, 6000)

const entityRows = 4
const entitiesInARow = 9

const floorSize = new Vector2(entitiesInARow * 500, 600 * entityRows)
const mesh = createPlaneMesh({ size: floorSize, texture: Texture.missingTexture })
applyTransformations(mesh)
mesh.translateX(map.config.offset.x)
mesh.translateY(map.config.offset.y)
mesh.translateZ(map.config.offset.z + floorSize.y / 2 - 50)
applyTransformations(mesh)
map.polygons.addThreeJsMesh(mesh)

for (let j = 0; j < entityRows; j++) {
  const rowOfEntities = fixInters.slice(j * entitiesInARow, (j + 1) * entitiesInARow).map((name, i) => {
    const entity = new Entity({
      src: `fix_inter/${name}`,
      position: new Vector3((i - Math.floor(entitiesInARow / 2)) * 500, -10, 250 + j * 500),
      orientation: new Rotation(0, MathUtils.degToRad(-90), 0),
    })

    return entity
  })

  map.entities.push(...rowOfEntities)
}

const lights: Light[] = []

for (let j = 0; j < entityRows + 1; j++) {
  for (let i = 0; i < entitiesInARow + 1; i++) {
    lights.push(
      createLight({
        position: new Vector3((-Math.floor(entitiesInARow / 2) + i) * 500, -300, -50 + j * 500),
        radius: 700,
      }),
    )
  }
}

map.lights.push(...lights)

map.finalize(settings)
map.saveToDisk(settings)
