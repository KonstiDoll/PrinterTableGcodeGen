import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';

export function getThreejsObjectFromSvg(svgContent: string): Promise<THREE.Group> {
    const loader = new SVGLoader();
    const svg = loader.parse(svgContent);

    const paths: THREE.ShapePath[] = svg.paths;
    const group = new THREE.Group();
    paths.forEach((shapePath) => {
        const randomColor = Math.floor(Math.random() * 0xffffff);
        const material = new THREE.LineBasicMaterial({
            color: randomColor,
        });
        shapePath.subPaths.forEach((subPath:THREE.Line) => {
            // Get points from the subPath
            // If the subPath contains curves, you might want to get more points for a smoother line
            const points:THREE.Vector2[] = subPath.getPoints();
            // Create a geometry from the points
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            // Create a line from the geometry and material
            const line = new THREE.Line(geometry, material);
            line.userData = shapePath.userData;
            // Add the line to your group or scene
            group.add(line);
        });
    });
    // paths.forEach((path) => {
    //     const material = new THREE.MeshBasicMaterial({
    //         color: 0xffffff,
    //         side: THREE.DoubleSide,
    //         depthWrite: false
    //     });
    //     const shapes = path.toShapes(true);
    //     const geometry = new THREE.ShapeGeometry(shapes);
    //     const mesh = new THREE.Mesh(geometry, material);
    //     group.add(mesh);
    // });
    return group;
}