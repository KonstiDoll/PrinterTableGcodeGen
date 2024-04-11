import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';

export function getThreejsObjectFromSvg(svgContent: string): Promise<THREE.Group> {
    const loader = new SVGLoader();
    const svg = loader.parse(svgContent);

    const paths = svg.paths;
    const group = new THREE.Group();
    paths.forEach((path) => {
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            depthWrite: false
        });
        const shapes = path.toShapes(true);
        const geometry = new THREE.ShapeGeometry(shapes);
        const mesh = new THREE.Mesh(geometry, material);
        group.add(mesh);
    });
    return group;
}