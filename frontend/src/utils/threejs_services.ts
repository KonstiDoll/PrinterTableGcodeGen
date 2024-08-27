import * as THREE from 'three';
//@ts-ignore
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { computed } from 'vue';

export function getThreejsObjectFromSvg(svgContent: string): THREE.Group {
    const loader = new SVGLoader();
    const svg = loader.parse(svgContent);

    const paths: THREE.ShapePath[] = svg.paths;
    const group = new THREE.Group();
    paths.forEach((shapePath) => {
        console.log('shapepath: ', shapePath)
        const randomColor = Math.floor(Math.random() * 0xffffff);
        const material = new THREE.LineBasicMaterial({
            color: randomColor,
        });
        shapePath.subPaths.forEach((subPath: THREE.Path) => {
            // Get points from the subPath
            // If the subPath contains curves, you might want to get more points for a smoother line
            const points: THREE.Vector2[] = subPath.getPoints();
            // Create a geometry from the points
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            // Create a line from the geometry and material
            const line = new THREE.Line(geometry, material);
            line.userData = shapePath.userData;
            if (subPath.curves.length > 1) {
                const isClosed = computed(() => {
                    if (subPath.autoClose) {
                        return true;
                    }
                    if (subPath.curves[0].v1.x === subPath.curves[subPath.curves.length - 1].v2.x && subPath.curves[0].v1.y === subPath.curves[subPath.curves.length - 1].v2.y) {
                        return true;
                    }
                })
                line.userData.isClosed = isClosed.value;

            }
            // if (!line.userData.isClosed) {
            //     group.add(line);
            // }
            group.add(line);
        });
    });
    //chech for closedPaths and create shapes from them

    // const closedPaths = paths.filter((path) => path.userData.isClosed);
    // closedPaths.forEach((path) => {
    //     console.log('path: ', path)
    //     path.subPaths.forEach((subPath) => {
    //         const curves = subPath.curves;
    //         const infillLines = connectPointsOfCurves(curves)
    //         infillLines.forEach((line) => {
    //             const material = new THREE.LineBasicMaterial({
    //                 color: 0xffffff,
    //             });
    //             const geometry = new THREE.BufferGeometry().setFromPoints([line.start, line.end]);
    //             const lineMesh = new THREE.Line(geometry, material);
    //             group.add(lineMesh);
    //         })
    //     });
    // });
    // const sortedGroup = sortLines(group);
    return group;
}

const sortLines = (group: THREE.Group) => {
    // Function to compute distance between two points
    const distance = (a, b) => a.distanceTo(b);

    // Extract first and last points from each line
    const endpoints = group.children.map(line => {
        const positions = line.geometry.attributes.position.array;
        const numPoints = positions.length / 3;
        return {
            start: new THREE.Vector3(positions[0], positions[1], positions[2]),
            end: new THREE.Vector3(positions[(numPoints - 1) * 3], positions[(numPoints - 1) * 3 + 1], positions[(numPoints - 1) * 3 + 2])
        };
    });

    let sortedLines = [];
    let currentLineIndex = 0; // Start from the first line
    sortedLines.push(group.children[currentLineIndex]);

    // Nearest neighbor greedy algorithm
    for (let i = 1; i < endpoints.length; i++) {
        const lastEndpoint = endpoints[currentLineIndex].end;
        let minDistance = Infinity;
        let nextIndex = -1;

        for (let j = 0; j < endpoints.length; j++) {
            if (j !== currentLineIndex && !sortedLines.includes(group.children[j])) {
                const start = endpoints[j].start;
                const dist = distance(lastEndpoint, start);
                if (dist < minDistance) {
                    minDistance = dist;
                    nextIndex = j;
                }
            }
        }

        if (nextIndex >= 0) {
            sortedLines.push(group.children[nextIndex]);
            currentLineIndex = nextIndex;
        }
    }
    // Replace original group's children with sorted lines
    group.children = sortedLines;
}
function connectPointsOfCurves(curves: THREE.Curve<THREE.Vector2>[]): THREE.Line3[] {
    let points: THREE.Vector2[] = [];
    curves.forEach(curve => {
        points = points.concat(curve.getPoints()); // Get points from curve
    });
    const lines: THREE.Line3[] = [];
    const points3D = points.map((point) => new THREE.Vector3(point.x, point.y, 0));
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            lines.push(new THREE.Line3(points3D[i], points3D[j]));
        }
    }
    return lines;
}

export function createShapesForClosedPaths(paths: THREE.ShapePath[]): THREE.Mesh[] {

    return paths.map((path) => {
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            depthWrite: false
        });
        const shapes = path.toShapes(true);
        const geometry = new THREE.ShapeGeometry(shapes);
        const mesh = new THREE.Mesh(geometry, material);
        return mesh;
    });
};