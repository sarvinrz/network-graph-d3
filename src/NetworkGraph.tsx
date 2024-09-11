import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface NodeDatum extends d3.SimulationNodeDatum {
    id: string;
    label: string;
    url?: string;
    imageUrl?: string;
}

interface LinkDatum extends d3.SimulationLinkDatum<d3.SimulationNodeDatum> {
    source: d3.SimulationNodeDatum;
    target: d3.SimulationNodeDatum;
    label: string;
}

const NetworkGraph: React.FC = () => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateDimensions = () => {
            if (svgRef.current) {
                setDimensions({
                    width: window.innerWidth,
                    height: window.innerHeight
                });
            }
        };

        window.addEventListener('resize', updateDimensions);
        updateDimensions();

        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    useEffect(() => {
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const { width, height } = dimensions;

        const data = {
            nodes: [
                { id: "Apple", label: "اپل", url: "https://www.apple.com", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/732px-Apple_logo_black.svg.png?20220821121934" },
                { id: "Samsung", label: "سامسونگ", url: "https://www.samsung.com", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/1200px-Samsung_Logo.svg.png?20221128191222" },
                { id: "Next", label: "نکست", url: "https://nextjs.org", imageUrl: "https://cdn.worldvectorlogo.com/logos/next-js.svg" },
                { id: "Vite", label: "ویت", url: "https://vitejs.dev", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Vitejs-logo.svg/1039px-Vitejs-logo.svg.png" },
            ] as NodeDatum[],
            links: [
                { source: "Apple", target: "Samsung", label: "رقیب" },
                { source: "Apple", target: "Next", label: "بدون ارتباط" },
                { source: "Samsung", target: "Vite", label: "بدون ارتباط" },
                { source: "Vite", target: "Apple", label: "جدید" }
            ]
        };

        const simulation = d3.forceSimulation<NodeDatum>(data.nodes)
            .force('link', d3.forceLink<NodeDatum, d3.SimulationLinkDatum<NodeDatum>>(data.links).id((d) => d.id).distance(150))
            .force('charge', d3.forceManyBody().strength(-500))
            .force('center', d3.forceCenter(width / 2, height / 2));

        // تابع کمکی برای ایجاد مسیر فلش
        function linkArc(d) {
            const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
            return `
                M${d.source.x},${d.source.y}
                A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
            `;
        }

        // به جای خطوط، از مسیرها استفاده کنید
        const link = svg.append("g")
            .attr("fill", "none")
            .attr("stroke-width", 1.5)
            .selectAll("path")
            .data(data.links)
            .join("path")
            .attr("stroke", "#999")
            .attr("marker-end", "url(#arrow)");

        // اضافه کردن برچسب‌های لینک
        const linkLabel = svg.append("g")
            .attr("class", "link-labels")
            .selectAll("text")
            .data(data.links)
            .join("text")
            .text(d => d.label)
            .attr("font-size", "12px")
            .attr("text-anchor", "middle");

        // تعریف نشانگر فلش
        svg.append("defs").selectAll("marker")
            .data(["arrow"])
            .join("marker")
            .attr("id", "arrow")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 15)
            .attr("refY", -0.5)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("path")
            .attr("fill", "#999")
            .attr("d", "M0,-5L10,0L0,5");

        const nodeGroup = svg.append('g')
            .selectAll('g')
            .data(data.nodes)
            .enter().append('g')
            .call(d3.drag<SVGGElement, NodeDatum>()
                .on('start', (event) => {
                    d3.select(event.sourceEvent.target.parentNode).raise();
                    simulation.alphaTarget(0.3).restart();
                })
                .on('drag', (event, d) => {
                    d.fx = event.x;
                    d.fy = event.y;
                })
                .on('end', (event, d) => {
                    if (!event.active) simulation.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                }));

        nodeGroup.append('image')
            .attr('xlink:href', d => d.imageUrl ?? '')
            .attr('width', 40)
            .attr('height', 40)
            .attr('x', -20)
            .attr('y', -20);

        nodeGroup.append('text')
            .text(d => d.label)
            .attr('text-anchor', 'middle')
            .attr('dy', '30px');

        nodeGroup.on('click', (event, d: NodeDatum) => {
            console.log(`گره کلیک شده: ${d.label}`);
            window.open(d.url, '_blank');
        });

        // به‌روزرسانی تابع ticked
        function ticked() {
            link.attr("d", linkArc);

            linkLabel
                .attr('x', (d: any) => ((d.source as any).x + (d.target as any).x) / 2)
                .attr('y', (d: any) => ((d.source as any).y + (d.target as any).y) / 2);

            nodeGroup
                .attr('transform', d => `translate(${d.x},${d.y})`);
        }

        simulation.on('tick', ticked);

    }, [dimensions]);

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <h1>d3 نمودار </h1>
            <svg ref={svgRef} width={dimensions.width} height={dimensions.height}></svg>
        </div>
    );
};

export default NetworkGraph;
