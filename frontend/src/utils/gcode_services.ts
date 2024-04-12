import * as THREE from 'three';

export function createGcodeFromLineGroup(lineGeoGroup: THREE.Group): string {
    let gCode = '';
    lineGeoGroup.children.forEach((lineGeo: any) => {
        const gcodeLine = createGcodeFromLine(lineGeo);
        gCode += gcodeLine;
    });
    return gCode;
}
function createGcodeFromLine(lineGeo: any): string {
    let gcode = '';
    lineGeo.geometry.attributes.position.array.forEach((pos: any, index: number) => {
        if (index % 3 === 0) {
            const x = pos.toFixed(2);
            const y = lineGeo.geometry.attributes.position.array[index + 1].toFixed(2);
            const z = lineGeo.geometry.attributes.position.array[index + 2].toFixed(2);
            const gcodeLine = 'G1 X' + x + ' Y' + y + ' Z' + z + ' F3000\n';
            gcode += gcodeLine;
        }
    });
    return gcode;
}