import { GraphCanvas } from "reagraph";


const Graph = ({ reactLogo, viteLogo }) => {
    return (
        <>
            <GraphCanvas
                cameraMode='orbit'
                labelType="all"
                layoutType="custom"
                layoutOverrides={{
                    getNodePosition: (id, { nodes }) => {
                        const idx = nodes.findIndex(n => n.id === id);
                        const node = nodes[idx];

                        // IMPORTANT CODE HERE
                        return {
                            x: 50 * idx,
                            y: idx % 2 === 0 ? 0 : 50,
                            z: 1
                        };
                    }
                }}
                nodes={[
                    {
                        id: '1',
                        label: 'react',
                        icon: reactLogo,
                        subLabel: 'SubLabel 1\n\rTest\n\rIP:10.1.1.1'
                    },
                    {
                        id: '2',
                        label: 'vite',
                        icon: viteLogo
                    },
                    {
                        id: '3',
                        label: 'node',
                        // icon: reactLogo
                    },
                ]}
                edges={[
                    {
                        id: 'x',
                        source: '1',
                        target: '2',
                        label: 'Edge 1-2',
                    },
                    {
                        id: '2->3',
                        source: '2',
                        target: '3',
                        label: 'Edge 2-3'
                    }
                ]}
                draggable
                onNodeDoubleClick={(node, e) => console.log(node.label)}
            />
        </>
    );
}

export default Graph;