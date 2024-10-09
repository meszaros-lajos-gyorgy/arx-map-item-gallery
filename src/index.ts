import { ArxMap, Entity, HudElements, Light, Rotation, Settings, Texture, Vector3 } from 'arx-level-generator'
import { createPlaneMesh } from 'arx-level-generator/prefabs/mesh'
import { createLight } from 'arx-level-generator/tools'
import { applyTransformations } from 'arx-level-generator/utils'
import { MathUtils, Mesh, Vector2 } from 'three'
import { entitiesInARow, entityRows, fixInters } from '@/constants.js'

const settings = new Settings()
const map = new ArxMap()

map.config.offset = new Vector3(6000, 0, 4000)
map.hud.hide(HudElements.Minimap)

// ------------------

const meshes: Mesh[] = []

const floorSize = new Vector2(entitiesInARow * 500, 500 * entityRows + 200)
const floor = createPlaneMesh({ size: floorSize, texture: Texture.l1PrisonSandGround01 })
floor.translateZ(floorSize.y / 2 - 100)
meshes.push(floor)

meshes.forEach((mesh) => {
  applyTransformations(mesh)
  mesh.translateX(map.config.offset.x)
  mesh.translateY(map.config.offset.y)
  mesh.translateZ(map.config.offset.z)
  applyTransformations(mesh)
  map.polygons.addThreeJsMesh(mesh)
})

// ------------------

const entities: Entity[] = []

for (let j = 0; j < entityRows; j++) {
  const rowOfEntityNames = fixInters.slice(j * entitiesInARow, (j + 1) * entitiesInARow)
  const rowOfEntities = rowOfEntityNames.map((name, i) => {
    const entity = new Entity({
      src: `fix_inter/${name}`,
      position: new Vector3((i - Math.floor(entitiesInARow / 2)) * 500, -10, 250 + j * 500),
      orientation: new Rotation(0, MathUtils.degToRad(-90), 0),
    })

    if (name === 'pressurepad_gob') {
      entity.withScript()
      entity.script?.on('init', () => {
        return `refuse`
      })
    }

    return entity
  })
  entities.push(...rowOfEntities)
}

map.entities.push(...entities)

// ------------------

const lights: Light[] = []

for (let j = 0; j < entityRows + 1; j++) {
  for (let i = 0; i < entitiesInARow + 1; i++) {
    const light = createLight({
      position: new Vector3((-Math.floor(entitiesInARow / 2) + i) * 500, -300, -50 + j * 500),
      radius: 700,
    })
    lights.push(light)
  }
}

map.lights.push(...lights)

// ------------------

map.finalize(settings)
map.saveToDisk(settings)
