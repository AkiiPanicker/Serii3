// static/js/theorem_script.js (Final Version with 12 Theorems)

document.addEventListener('DOMContentLoaded', () => {
    // --- Get HTML Elements ---
    const numNodesInput = document.getElementById('sim-num-nodes');
    const randomBtn = document.getElementById('generate-random-btn');
    const connectionsContainer = document.getElementById('connections-container');
    const graphContainer = document.getElementById('graph-visualization');
    const resultsContainer = document.getElementById('simulation-results');
    const theoremSelect = document.getElementById('theorem-select');

    // --- VIS.JS Setup ---
    const nodes = new vis.DataSet([]);
    const edges = new vis.DataSet([]);
    const options = {
        nodes: { shape: 'circle', borderWidth: 2, font: { size: 16, color: '#343a40' } },
        edges: { 
            width: 2,
            arrows: { to: { enabled: false } } // Arrows disabled globally, enabled per-edge for Eulerian
        },
        physics: { enabled: true, solver: 'barnesHut' },
        interaction: { hover: true },
        manipulation: { enabled: false }
    };
    const network = new vis.Network(graphContainer, { nodes, edges }, options);


    // --- UTILITY & GRAPH ANALYSIS FUNCTIONS ---

    function resetAllStyles() {
        const allNodeIds = nodes.getIds();
        if (allNodeIds.length > 0) {
            const nodeUpdates = allNodeIds.map(id => ({ id, color: null, label: `${id}`, shape: 'circle', hidden: false }));
            nodes.update(nodeUpdates);
        }
        const allEdges = edges.get();
        if (allEdges.length > 0) {
            // Ensure arrows from Eulerian path are disabled on reset
            const edgeUpdates = allEdges.map(edge => ({ id: edge.id, color: null, width: 2, dashes: false, hidden: false, arrows: { to: { enabled: false } } }));
            edges.update(edgeUpdates);
        }
        network.off('click'); // Remove any lingering click listeners from interactive proofs
    }

    function buildAdjacencyList() {
        const adj = nodes.getIds().reduce((acc, id) => { acc[id] = []; return acc; }, {});
        edges.get().forEach(edge => {
            adj[edge.from].push(edge.to);
            adj[edge.to].push(edge.from);
        });
        return adj;
    }

    function analyzeGraphProperties() {
        const adj = buildAdjacencyList();
        const nodeIds = nodes.getIds();
        const p = nodeIds.length;
        const q = edges.get().length;

        if (p === 0) return { isConnected: true, hasCycle: false, isTree: false, p, q, components: [] };
        if (p === 1) return { isConnected: true, hasCycle: false, isTree: true, p, q, components: [[nodeIds[0]]]};

        const visited = new Set();
        const components = [];
        for (const startNode of nodeIds) {
            if (!visited.has(startNode)) {
                const component = [];
                const queue = [startNode];
                visited.add(startNode);
                let head = 0;
                while (head < queue.length) {
                    const u = queue[head++];
                    component.push(u);
                    for (const v of (adj[u] || [])) {
                        if (!visited.has(v)) { visited.add(v); queue.push(v); }
                    }
                }
                components.push(component);
            }
        }
        const isConnected = components.length === 1;
        // A graph is a tree if it's connected and has p-1 edges.
        const isTree = isConnected && q === p - 1;

        return { isConnected, isTree, p, q, components };
    }
    
    function getDegrees() {
        const degrees = nodes.getIds().reduce((acc, id) => { acc[id] = 0; return acc; }, {});
        edges.get().forEach(edge => {
            degrees[edge.from]++;
            degrees[edge.to]++;
        });
        return degrees;
    }

    function getMinDegree() {
        const degrees = getDegrees();
        const degreeValues = Object.values(degrees);
        return degreeValues.length > 0 ? Math.min(...degreeValues) : 0;
    }
    
    function buildComplementAdjacencyList() {
        const adj = {};
        const nodeIds = nodes.getIds();
        nodeIds.forEach(id => adj[id] = []);
        const existingEdges = new Set(edges.get().map(e => e.from < e.to ? `${e.from}-${e.to}` : `${e.to}-${e.from}`));
        for (let i = 0; i < nodeIds.length; i++) {
            for (let j = i + 1; j < nodeIds.length; j++) {
                const u = nodeIds[i], v = nodeIds[j];
                if (!existingEdges.has(`${u}-${v}`)) {
                    adj[u].push(v);
                    adj[v].push(u);
                }
            }
        }
        return adj;
    }

    function findTriangles(adjList, nodeIds) {
        if (nodeIds.length < 3) return null;
        for (let i = 0; i < nodeIds.length; i++) {
            for (let j = i + 1; j < nodeIds.length; j++) {
                for (let k = j + 1; k < nodeIds.length; k++) {
                    const u = nodeIds[i], v = nodeIds[j], w = nodeIds[k];
                    if ((adjList[u]?.includes(v)) && (adjList[u]?.includes(w)) && (adjList[v]?.includes(w))) {
                        return [u, v, w];
                    }
                }
            }
        }
        return null;
    }

    function getDiameter(adjList, nodeIds) {
        if (nodeIds.length < 2) return 0;
        let maxEccentricity = 0;
        for (const startNode of nodeIds) {
            const distances = {};
            nodeIds.forEach(id => (distances[id] = Infinity));
            distances[startNode] = 0;
            const queue = [startNode];
            let head = 0;
            while(head < queue.length) {
                const u = queue[head++];
                for (const v of (adjList[u] || [])) {
                    if (distances[v] === Infinity) {
                        distances[v] = distances[u] + 1;
                        queue.push(v);
                    }
                }
            }
            let currentEccentricity = 0;
            for(const nodeId of nodeIds) {
                if (distances[nodeId] === Infinity) return Infinity; // Disconnected
                currentEccentricity = Math.max(currentEccentricity, distances[nodeId]);
            }
            maxEccentricity = Math.max(maxEccentricity, currentEccentricity);
        }
        return maxEccentricity;
    }
    
    function findShortestPath(startNode, endNode) {
        const adj = buildAdjacencyList();
        const q = [[startNode]];
        const visited = new Set([startNode]);
        while(q.length > 0) {
            const path = q.shift();
            const node = path[path.length - 1];
            if (node === endNode) return path;
            for(const neighbor of (adj[node] || [])) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    const newPath = [...path, neighbor];
                    q.push(newPath);
                }
            }
        }
        return null; // No path found
    }

    // --- THEOREM ALGORITHMS ---

    /** Theorem 1: Vertices of Odd Degree */
    function runOddDegreeAnalysis() {
        resetAllStyles();
        let oddCount = 0;
        const nodesToUpdate = Object.entries(getDegrees()).map(([nodeId, degree]) => {
            const isOdd = degree % 2 !== 0;
            if (isOdd) oddCount++;
            return {
                id: Number(nodeId),
                label: `Deg: ${degree}`,
                color: { background: isOdd ? '#ffcc80' : '#a4f5b3', border: isOdd ? '#ff9800' : '#4caf50' }
            };
        });
        if (nodesToUpdate.length > 0) nodes.update(nodesToUpdate);
        resultsContainer.innerHTML = `<h3>Results:</h3><p>Nodes with an odd degree: <strong>${oddCount}</strong></p><div class="conclusion">${oddCount} is an EVEN number!</div>`;
    }

    /** Theorem 2: Bipartite Graph Cycles */
    function runBipartiteAnalysis() {
        resetAllStyles();
        const adj = buildAdjacencyList();
        const nodeIds = nodes.getIds();
        const colors = {};
        for (const startNode of nodeIds) {
            if (!colors[startNode]) {
                const queue = [startNode];
                colors[startNode] = 1;
                while (queue.length > 0) {
                    const u = queue.shift();
                    for (const v of (adj[u] || [])) {
                        if (!colors[v]) {
                            colors[v] = 3 - colors[u];
                            queue.push(v);
                        } else if (colors[v] === colors[u]) {
                            displayBipartiteResult(false, { u, v }, colors);
                            return;
                        }
                    }
                }
            }
        }
        displayBipartiteResult(true, null, colors);
    }
    
    function displayBipartiteResult(isBipartite, conflict, colors) {
        if (isBipartite) {
            const nodesToUpdate = Object.entries(colors).map(([nodeId, color]) => ({
                id: Number(nodeId),
                label: `Group ${color}`,
                color: color === 1 ? { background: '#8ce2ff', border: '#009dff' } : { background: '#ffc382', border: '#ff8c00' }
            }));
            if (nodesToUpdate.length > 0) nodes.update(nodesToUpdate);
            resultsContainer.innerHTML = `<h3>Results:</h3><div class="conclusion">It's Bipartite!</div><p>All nodes can be split into two groups without internal connections.</p>`;
        } else {
            nodes.update(Object.keys(colors).map(id => ({ id: Number(id), color: { background: '#d1d1d1', border: '#aaaaaa' } })));
            nodes.update([{ id: conflict.u, color: '#ff7b7b' }, { id: conflict.v, color: '#ff7b7b' }]);
            const conflictEdge = edges.get({ filter: e => (e.from === conflict.u && e.to === conflict.v) || (e.from === conflict.v && e.to === conflict.u) })[0];
            if (conflictEdge) edges.update({ id: conflictEdge.id, color: 'red', width: 4 });
            resultsContainer.innerHTML = `<h3>Results:</h3><div class="conclusion" style="color: #d9534f;">NOT Bipartite!</div><p>Nodes ${conflict.u} and ${conflict.v} are connected, but coloring forces them into the same group. This proves an odd cycle exists.</p>`;
        }
    }
    
    /** Theorem 3: Ramsey's Theorem (R(3,3)=6) */
    function runRamseyAnalysis() {
        resetAllStyles();
        const nodeIds = nodes.getIds();
        if (nodeIds.length !== 6) {
            resultsContainer.innerHTML = `<h3>Results:</h3><p class="conclusion" style="color: #d9534f;">Theorem requires 6 nodes.</p><p>This theorem only applies to graphs with exactly 6 vertices.</p>`;
            return;
        }
        const adj = buildAdjacencyList();
        const triangleInG = findTriangles(adj, nodeIds);
        if (triangleInG) {
            highlightTriangle(triangleInG, true);
            resultsContainer.innerHTML = `<h3>Results:</h3><div class="conclusion">Triangle in G Found!</div><p>The nodes ${triangleInG.join(', ')} form a triangle in the graph.</p>`;
        } else {
            const complementAdj = buildComplementAdjacencyList();
            const triangleInGPrime = findTriangles(complementAdj, nodeIds);
            if (triangleInGPrime) {
                highlightTriangle(triangleInGPrime, false);
                resultsContainer.innerHTML = `<h3>Results:</h3><div class="conclusion" style="background-color: #007bff; color: white;">Triangle in G' Found!</div><p>No triangle exists in G. However, the nodes ${triangleInGPrime.join(', ')} form a triangle in the complement G'.</p>`;
            } else {
                resultsContainer.innerHTML = `<h3>Error:</h3><p>The theorem seems to have failed. This is unexpected.</p>`;
            }
        }
    }

    function highlightTriangle(triangleNodes, inG) {
        nodes.update(triangleNodes.map(id => ({ id: id, color: { background: '#ff7b7b', border: '#d9534f' } })));
        if (inG) {
            const [u, v, w] = triangleNodes;
            const edgeIds = [u < v ? `${u}-${v}` : `${v}-${u}`, u < w ? `${u}-${w}` : `${w}-${u}`, v < w ? `${v}-${w}` : `${w}-${v}`];
            const edgeUpdates = edges.get(edgeIds).map(e => ({...e, color: 'red', width: 4}));
            if (edgeUpdates.length > 0) edges.update(edgeUpdates);
        }
    }

    /** Theorem 4: Self-Complementary Rule */
    function runSelfComplementaryCheck() {
        resetAllStyles();
        const p = nodes.getIds().length;
        if (p < 2) { resultsContainer.innerHTML = `<h3>Results:</h3><p>Please add at least 2 nodes.</p>`; return; }
        if (p % 4 === 0 || p % 4 === 1) {
            resultsContainer.innerHTML = `<h3>Results:</h3><p>Number of vertices (p) = <strong>${p}</strong></p><p>A graph with ${p} vertices (p mod 4 = ${p % 4}) <strong>CAN</strong> be self-complementary.</p><div class="conclusion">Condition Met</div>`;
        } else {
            resultsContainer.innerHTML = `<h3>Results:</h3><p>Number of vertices (p) = <strong>${p}</strong></p><p>A graph with ${p} vertices (p mod 4 = ${p % 4}) <strong>CANNOT</strong> be self-complementary.</p><div class="conclusion" style="color: #d9534f;">Condition NOT Met</div>`;
        }
    }
    
    /** Theorem 5: Graph/Complement Diameter */
    function runDiameterAnalysis() {
        resetAllStyles();
        const nodeIds = nodes.getIds();
        if (nodeIds.length < 2) { resultsContainer.innerHTML = `<h3>Results:</h3><p>Please add at least 2 nodes.</p>`; return; }
        const adjG = buildAdjacencyList();
        const diamG = getDiameter(adjG, nodeIds);
        const adjGPrime = buildComplementAdjacencyList();
        const diamGPrime = getDiameter(adjGPrime, nodeIds);
        const diamGStr = diamG === Infinity ? "∞ (Disconnected)" : diamG;
        const diamGPrimeStr = diamGPrime === Infinity ? "∞ (Disconnected)" : diamGPrime;
        let conclusionHTML = `<p>Diameter of your graph, <strong>diam(G) = ${diamGStr}</strong></p>`;
        conclusionHTML += `<p>Diameter of the complement, <strong>diam(G') = ${diamGPrimeStr}</strong></p>`;
        if (diamG >= 3) {
            conclusionHTML += `<p style="margin-top: 15px;"><strong>Condition Met:</strong> diam(G) is ${diamGStr}, which is ≥ 3.</p>`;
            conclusionHTML += (diamGPrime <= 3)
                ? `<div class="conclusion">Theorem Holds! As predicted, diam(G') = ${diamGPrimeStr}, which is ≤ 3.</div>`
                : `<div class="conclusion" style="color: #d9534f;">Error! This is unexpected.</div>`;
        } else {
            conclusionHTML += `<p style="margin-top: 15px;"><strong>Condition Not Met:</strong> diam(G) is ${diamGStr}, which is not ≥ 3.</p><div class="conclusion" style="color: #6c757d; background-color: #f0f0f0;">The theorem does not apply, but the relationship is still shown.</div>`;
        }
        resultsContainer.innerHTML = `<h3>Results:</h3>${conclusionHTML}`;
    }

    /** Theorem 6: Self-Complementary Diameter */
    function runSCDiameterAnalysis() {
        resetAllStyles();
        const p = nodes.getIds().length;
        if (p < 2) {
            resultsContainer.innerHTML = `<h3>Results:</h3><p>Theorem requires a non-trivial graph (2+ vertices).</p>`;
            return;
        }
        if (p % 4 !== 0 && p % 4 !== 1) {
            resultsContainer.innerHTML = `<h3>Results:</h3><p>A graph with ${p} vertices <strong>CANNOT</strong> be self-complementary.</p><div class="conclusion" style="color: #6c757d; background-color: #f0f0f0;">The theorem does not apply.</div>`;
            return;
        }
        const adjG = buildAdjacencyList();
        const diamG = getDiameter(adjG, nodes.getIds());
        const diamGStr = diamG === Infinity ? "∞" : diamG;
        let conclusionHTML = `<p>A graph with ${p} vertices <strong>CAN</strong> be self-complementary.</p>`;
        conclusionHTML += `<p>This graph's diameter is: <strong>${diamGStr}</strong></p>`;
        if (diamG === 2 || diamG === 3) {
            conclusionHTML += `<div class="conclusion">Theorem Holds! The diameter is 2 or 3, as expected for a self-complementary graph.</div>`;
        } else {
            conclusionHTML += `<div class="conclusion" style="color: #d9534f;">Violation! The diameter is not 2 or 3. Therefore, this specific graph is <strong>not</strong> self-complementary.</div>`;
        }
        resultsContainer.innerHTML = `<h3>Results:</h3>${conclusionHTML}`;
    }

    /** Theorem 7: G or G' is Connected */
    function runConnectivityAnalysis() {
        resetAllStyles();
        const nodeIds = nodes.getIds();
        if (nodeIds.length < 2) {
            resultsContainer.innerHTML = `<h3>Results:</h3><p>Graph must have at least 2 vertices.</p>`;
            return;
        }
        const diamG = getDiameter(buildAdjacencyList(), nodeIds);
        if (diamG !== Infinity) {
             resultsContainer.innerHTML = `<h3>Results:</h3><p>Your graph G is <strong>Connected</strong> (diameter = ${diamG}).</p><div class="conclusion">Theorem Holds!</div>`;
        } else {
            const diamGPrime = getDiameter(buildComplementAdjacencyList(), nodeIds);
            let conclusionHTML = `<p>Your graph G is <strong>Disconnected</strong>.</p>`;
            if (diamGPrime !== Infinity) {
                conclusionHTML += `<p>Its complement G' is <strong>Connected</strong> (diameter = ${diamGPrime}).</p><div class="conclusion">Theorem Holds!</div>`;
            } else {
                conclusionHTML += `<p>Its complement G' is also <strong>Disconnected</strong>.</p><div class="conclusion" style="color: #d9534f;">Error! This violates the theorem. (Theoretically impossible).</div>`;
            }
             resultsContainer.innerHTML = `<h3>Results:</h3>${conclusionHTML}`;
        }
    }

    /** Theorem 8: Minimum Degree Connectivity */
    function runMinDegreeConnectivity() {
        resetAllStyles();
        const nodeIds = nodes.getIds();
        const p = nodeIds.length;
        if (p < 2) {
            resultsContainer.innerHTML = `<h3>Results:</h3><p>A graph with ${p} vertex is trivially connected.</p>`;
            return;
        }

        const minDegree = getMinDegree();
        const threshold = (p - 1) / 2;
        const isConnected = getDiameter(buildAdjacencyList(), nodeIds) !== Infinity;

        let conclusionHTML = `<p>Vertices (p): <strong>${p}</strong></p>`;
        conclusionHTML += `<p>Minimum Degree (δ): <strong>${minDegree}</strong></p>`;
        conclusionHTML += `<p>Threshold ((p-1)/2): <strong>${threshold.toFixed(2)}</strong></p>`;

        if (minDegree > threshold) {
            conclusionHTML += `<p style="margin-top: 15px;"><strong>Condition Met:</strong> δ (${minDegree}) > ${threshold.toFixed(2)}.</p>`;
            if (isConnected) {
                conclusionHTML += `<div class="conclusion">Theorem Holds! As predicted, the graph is Connected.</div>`;
            } else {
                 conclusionHTML += `<div class="conclusion" style="color: #d9534f;">Error! This violates the theorem. (Theoretically impossible).</div>`;
            }
        } else {
            conclusionHTML += `<p style="margin-top: 15px;"><strong>Condition NOT Met:</strong> δ (${minDegree}) ≤ ${threshold.toFixed(2)}.</p>`;
            conclusionHTML += `<div class="conclusion" style="color: #6c757d; background-color: #f0f0f0;">The theorem makes no guarantee. This graph is <strong>${isConnected ? 'Connected' : 'Disconnected'}</strong>.</div>`;
        }
        resultsContainer.innerHTML = `<h3>Results:</h3>${conclusionHTML}`;
    }

    /** Theorem 9: Unique Path in a Tree */
    function runUniquePathAnalysis() {
        resetAllStyles();
        const { isTree, isConnected, components } = analyzeGraphProperties();

        if (isTree) {
            resultsContainer.innerHTML = `<h3>Results:</h3><div class="conclusion">This is a Tree!</div><p>Click any two nodes to highlight the unique path between them.</p>`;
            let firstNode = null;
            network.on('click', (params) => {
                if (params.nodes.length > 0) {
                    const clickedNode = params.nodes[0];
                    if (!firstNode) {
                        firstNode = clickedNode;
                        nodes.update({ id: firstNode, color: { background: '#ffcc80', border: '#ff9800' } });
                        resultsContainer.innerHTML += `<p>First node selected: ${firstNode}. Now select the second node.</p>`;
                    } else if (clickedNode !== firstNode) {
                        network.off('click'); // Disable further clicks
                        const secondNode = clickedNode;
                        const path = findShortestPath(firstNode, secondNode);
                        if (path) {
                            const pathEdges = [];
                            for (let i = 0; i < path.length - 1; i++) {
                                let u = path[i], v = path[i+1];
                                let edge = edges.get({filter: e => (e.from===u && e.to===v) || (e.from===v && e.to===u)})[0];
                                if (edge) pathEdges.push(edge.id);
                            }
                            nodes.update(path.map(id => ({ id, color: { background: '#a4f5b3', border: '#4caf50' } })));
                            edges.update(pathEdges.map(id => ({ id, color: 'green', width: 4 })));
                            resultsContainer.innerHTML = `<h3>Results:</h3><div class="conclusion">Unique Path Found!</div><p>Path: ${path.join(' &rarr; ')}</p>`;
                        }
                    }
                }
            });
        } else {
            let reason = '';
            if (!isConnected) {
                reason = 'It is <strong>disconnected</strong>. Some nodes have no path between them.';
                if(components.length > 1) { // Highlight first two components for clarity
                    nodes.update(components[0].map(id => ({ id, color: {background: '#ffc382'} })));
                    nodes.update(components[1].map(id => ({ id, color: {background: '#8ce2ff'} })));
                }
            } else { // Connected but not a tree implies it has cycles.
                reason = 'It contains one or more <strong>cycles</strong>. Some nodes have multiple paths between them.';
            }
            resultsContainer.innerHTML = `<h3>Results:</h3><div class="conclusion" style="color: #d9534f;">This is NOT a Tree!</div><p>${reason}</p>`;
        }
    }

    /** Theorem 10: Edges in a Tree */
    function runTreeEdgesAnalysis() {
        resetAllStyles();
        const { isTree, p, q } = analyzeGraphProperties();
        let html = `<h3>Results:</h3><p>Vertices (p): <strong>${p}</strong></p><p>Edges (q): <strong>${q}</strong></p>`;

        if (isTree) {
            html += `<p>Condition Check: <strong>q = p - 1</strong> &nbsp;&rArr;&nbsp; <strong>${q} = ${p} - 1</strong></p>`;
            html += `<div class="conclusion">Theorem Holds!</div><p style="margin-top: 15px;"><strong>Interactive Proof:</strong> Click any edge to remove it and see the inductive step.</p>`;
            resultsContainer.innerHTML = html;

            network.once('click', (params) => {
                if (params.edges.length > 0) {
                    const edgeId = params.edges[0];
                    const removedEdge = edges.get(edgeId);
                    
                    // Temporarily hide for analysis
                    edges.update({id: edgeId, hidden: true });
                    const { components } = analyzeGraphProperties(); 
                    
                    if (components.length === 2) {
                        nodes.update(components[0].map(id => ({ id, color: { background: '#ffc382' } })));
                        nodes.update(components[1].map(id => ({ id, color: { background: '#8ce2ff' } })));
                        
                        const m = components[0].length, n = components[1].length;
                        let proofHtml = `<h3>Proof Step:</h3><p>Removing edge <strong>${removedEdge.from}-${removedEdge.to}</strong> splits the tree into 2 components (sub-trees).</p>`;
                        proofHtml += `<p>Component 1 has <strong>m=${m}</strong> vertices and (by induction) <strong>m-1 = ${m-1}</strong> edges.</p>`;
                        proofHtml += `<p>Component 2 has <strong>n=${n}</strong> vertices and (by induction) <strong>n-1 = ${n-1}</strong> edges.</p>`;
                        proofHtml += `<p>Total edges = (m-1) + (n-1) + 1 (the removed edge) = ${m-1+n-1+1} which equals <strong>p-1</strong> (${p-1}).</p>`;
                        resultsContainer.innerHTML = proofHtml;
                    }
                    edges.update({id: edgeId, hidden: false, color: 'red', width: 4 }); // Show the edge again, but highlighted
                }
            });
        } else {
             html += `<div class="conclusion" style="color: #d9534f;">This is NOT a Tree!</div>`
             if (q === p - 1) {
                html += `<p>This graph has p-1 edges, but it's <strong>disconnected</strong>. A tree must be connected.</p>`;
            } else {
                html += `<p>A tree with ${p} vertices must have ${p - 1} edges, but this graph has ${q}.</p>`;
            }
             resultsContainer.innerHTML = html;
        }
    }

    /** Theorem 11: Center of a Tree */
    async function runTreeCenterAnalysis() {
        resetAllStyles();
        const { isTree, p } = analyzeGraphProperties();
        if (!isTree) {
            resultsContainer.innerHTML = `<h3>Results:</h3><div class="conclusion" style="color: #d9534f;">This is NOT a Tree!</div><p>This theorem only applies to trees.</p>`;
            return;
        }
        if (p <= 2) {
            nodes.update(nodes.getIds().map(id => ({id, color: {background: '#ffcc80', border: '#ff9800'}, shape: 'star' })));
            resultsContainer.innerHTML = `<h3>Results:</h3><div class="conclusion">The entire graph is the center.</div>`;
            return;
        }

        resultsContainer.innerHTML = '<h3>Step-by-Step Proof:</h3><div id="center-steps"><p>We will iteratively remove all leaf nodes (degree 1) until the center is revealed.</p></div>';
        const stepsDiv = document.getElementById('center-steps');
        
        // Use copies to not destroy the original graph data
        let currentNodes = new vis.DataSet(nodes.get());
        let currentEdges = new vis.DataSet(edges.get());
        let step = 1;
        
        while (currentNodes.length > 2) {
            // Find leaves in the current graph copy
            const degrees = {};
            currentNodes.getIds().forEach(id => { degrees[id] = 0; });
            currentEdges.get().forEach(edge => {
                if (degrees[edge.from] !== undefined) degrees[edge.from]++;
                if (degrees[edge.to] !== undefined) degrees[edge.to]++;
            });
            const leaves = Object.keys(degrees).filter(id => degrees[id] === 1).map(Number);
            
            if (leaves.length === 0) break; // Safety break for non-tree graphs

            stepsDiv.innerHTML += `<p><strong>Step ${step++}:</strong> Removing ${leaves.length} leaf node(s): ${leaves.join(', ')}</p>`;
            nodes.update(leaves.map(id => ({ id, color: { background: '#e0e0e0', border: '#a0a0a0'} })));
            await new Promise(r => setTimeout(r, 1500)); // Pause for 1.5s
            
            const edgesToRemove = currentEdges.get({ filter: e => leaves.includes(e.from) || leaves.includes(e.to) });
            
            // Animate removal on main graph
            nodes.update(leaves.map(id => ({ id, hidden: true })));
            edges.update(edgesToRemove.map(e => ({ id: e.id, hidden: true })));
            
            // Actually remove from copies for next iteration's logic
            currentNodes.remove(leaves);
            currentEdges.remove(edgesToRemove.map(e => e.id));
            await new Promise(r => setTimeout(r, 1000)); // Pause for 1s
        }

        const centerNodes = currentNodes.getIds();
        stepsDiv.innerHTML += `<p><strong>Final Step:</strong> Process complete.</p>`;
        // Unhide and highlight the center nodes on the main graph
        nodes.update(centerNodes.map(id => ({ id, hidden: false, shape: 'star', color: { background: '#ffcc80', border: '#ff9800' } })));
        
        const conclusion = centerNodes.length === 1 
            ? `The center is a single vertex: <strong>${centerNodes[0]}</strong>.` 
            : `The center is two adjacent vertices: <strong>${centerNodes.join(' and ')}</strong>.`;
        resultsContainer.innerHTML += `<div class="conclusion">${conclusion}</div>`;
    }

    /** Theorem 12: Eulerian Circuit */
    function findEulerianCircuit() {
        // Implementation of Hierholzer's algorithm
        const adj = buildAdjacencyList();
        const nodeIds = nodes.getIds();
        if(nodeIds.length === 0) return null;

        // Clone the adjacency list to track unused edges, as we'll be modifying it
        let adjClone = {};
        for (const key in adj) {
            adjClone[key] = [...adj[key]];
        }
    
        // Find a starting node. In a connected graph with even degrees, any node works.
        const startNode = nodeIds[0];
        let currPath = [startNode]; // A temporary path/stack
        let circuit = []; // The final circuit
    
        while (currPath.length > 0) {
            let u = currPath[currPath.length - 1]; // Current vertex is top of the stack
            // If there's an unused edge from the current vertex
            if (adjClone[u].length > 0) {
                // Find a neighbor and move to it
                let v = adjClone[u].pop();
                
                // Remove the corresponding edge from the neighbor's list to mark it as used
                // This is crucial for undirected graphs.
                const v_index = adjClone[v].indexOf(u);
                if (v_index > -1) {
                    adjClone[v].splice(v_index, 1);
                }

                // Add the new vertex to the current path
                currPath.push(v);
            } else {
                // If the current vertex has no more outgoing edges,
                // it means we've completed a cycle (or sub-cycle).
                // Add it to our final circuit.
                circuit.push(currPath.pop());
            }
        }
        
        // The circuit is built backwards, so we reverse it for the correct order
        return circuit.reverse();
    }
    
    function runEulerianAnalysis() {
        resetAllStyles();
        const { p, isConnected } = analyzeGraphProperties();
        const degrees = getDegrees();
        const oddDegreeVertices = Object.keys(degrees).filter(id => degrees[id] % 2 !== 0);
        
        if (p === 0) {
            resultsContainer.innerHTML = '<h3>Results:</h3><p>Graph is empty.</p>';
            return;
        }

        if (!isConnected) {
            resultsContainer.innerHTML = `<h3>Results:</h3><div class="conclusion" style="color: #d9534f;">NOT Eulerian</div><p>The graph must be connected to have an Eulerian circuit.</p>`;
            return;
        }

        if (oddDegreeVertices.length > 0) {
            nodes.update(oddDegreeVertices.map(id => ({ id: Number(id), color: { background: '#ff7b7b', border: '#d9534f' } })));
            resultsContainer.innerHTML = `<h3>Results:</h3><div class="conclusion" style="color: #d9534f;">NOT Eulerian</div><p>All vertices must have an even degree. Problematic vertices: <strong>${oddDegreeVertices.join(', ')}</strong></p>`;
        } else {
            resultsContainer.innerHTML = `<h3>Results:</h3><div class="conclusion">IS Eulerian!</div><p>The graph is connected and all vertices have an even degree.</p><button id="find-circuit-btn" class="form-button">Find Eulerian Circuit</button>`;
            
            document.getElementById('find-circuit-btn').addEventListener('click', async (e) => {
                const btn = e.target;
                btn.disabled = true;
                btn.innerText = 'Animating...';

                const circuit = findEulerianCircuit();
                if (!circuit) return;
                
                let pathString = `<strong>Circuit:</strong> ${circuit[0]}`;
                resultsContainer.innerHTML = `<h3>Step-by-Step Pathfinding:</h3><p id="circuit-path-display">${pathString}</p>`;
                const pathDisplay = document.getElementById('circuit-path-display');

                nodes.update({ id: circuit[0], color: { background: '#a4f5b3' }});
                
                for(let i = 0; i < circuit.length - 1; i++) {
                    const u = circuit[i];
                    const v = circuit[i+1];
                    const edgeId = u < v ? `${u}-${v}` : `${v}-${u}`;
                    
                    await new Promise(r => setTimeout(r, 600)); // Pause between steps
                    
                    edges.update({ id: edgeId, color: '#4caf50', width: 4, arrows: {to: {enabled: true, scaleFactor:1.2}}});
                    nodes.update({ id: v, color: { background: '#a4f5b3' }});

                    pathString += ` &rarr; ${v}`;
                    pathDisplay.innerHTML = pathString;
                }
                
                resultsContainer.innerHTML += `<div class="conclusion" style="margin-top: 15px;">Circuit Complete!</div>`;
                btn.style.display = 'none'; // Hide button after animation completes
            });
        }
    }


    // --- MASTER CONTROL & EVENT LOGIC ---

    function runActiveTheorem() {
        resetAllStyles(); // Essential first step
        const theorem = theoremSelect.value;
        if (theorem === 'odd_degree') runOddDegreeAnalysis();
        else if (theorem === 'bipartite') runBipartiteAnalysis();
        else if (theorem === 'ramsey_R33') runRamseyAnalysis();
        else if (theorem === 'self_complementary') runSelfComplementaryCheck();
        else if (theorem === 'diameter') runDiameterAnalysis();
        else if (theorem === 'sc_diameter') runSCDiameterAnalysis();
        else if (theorem === 'g_g_prime_connected') runConnectivityAnalysis();
        else if (theorem === 'min_degree_connect') runMinDegreeConnectivity();
        else if (theorem === 'unique_path') runUniquePathAnalysis();
        else if (theorem === 'tree_edges') runTreeEdgesAnalysis();
        else if (theorem === 'tree_center') runTreeCenterAnalysis();
        else if (theorem === 'eulerian') runEulerianAnalysis(); // Added new theorem
    }

    function setupNewGraph() {
        const num = parseInt(numNodesInput.value, 10) || 0;
        nodes.clear();
        edges.clear();
        if (num > 0 && num <= 15) {
            const newNodes = Array.from({ length: num }, (_, i) => ({ id: i + 1, label: `${i + 1}`, size: 25 }));
            nodes.add(newNodes);
        }
        createManualControls(num);
        runActiveTheorem();
    }
    
    function generateRandomGraph() {
        const num = parseInt(numNodesInput.value, 10);
        if (num < 1 || num > 15) return;
        const isTreeTheorem = ['unique_path', 'tree_edges', 'tree_center'].includes(theoremSelect.value);
        edges.clear();
        const newEdges = [];

        if (isTreeTheorem && num > 0) {
            // Generate a random tree using a simple algorithm
            const addedNodes = [];
            if (num > 0) addedNodes.push(1);
            for (let i = 2; i <= num; i++) {
                // Connect the new node 'i' to a random existing node in the tree
                const connectToNode = addedNodes[Math.floor(Math.random() * addedNodes.length)];
                newEdges.push({ id: `${Math.min(i, connectToNode)}-${Math.max(i, connectToNode)}`, from: i, to: connectToNode });
                addedNodes.push(i);
            }
        } else {
            // Standard random graph generation
            for (let i = 1; i <= num; i++) {
                for (let j = i + 1; j <= num; j++) {
                    if (Math.random() < 0.4) newEdges.push({ id: `${i}-${j}`, from: i, to: j });
                }
            }
        }
        if (newEdges.length > 0) edges.add(newEdges);
        syncCheckboxesToGraph();
        setTimeout(runActiveTheorem, 50); // Small delay to let DOM update
    }
    
    function createManualControls(num) {
        connectionsContainer.innerHTML = '';
        if (num < 2) return;
        for (let i = 1; i <= num; i++) {
            const group = document.createElement('div');
            group.className = 'connection-group';
            group.innerHTML = `<div class="connection-group-title">Node ${i} connects to:</div>`;
            const list = document.createElement('div');
            list.className = 'checkbox-list';
            for (let j = 1; j <= num; j++) {
                if (i === j) continue; // No self-loops in controls
                list.innerHTML += `<label class="checkbox-item"><input type="checkbox" data-from="${i}" data-to="${j}">${j}</label>`;
            }
            group.appendChild(list);
            connectionsContainer.appendChild(group);
        }
    }

    function syncCheckboxesToGraph() {
        document.querySelectorAll('#connections-container input[type="checkbox"]').forEach(cb => cb.checked = false);
        edges.forEach(e => {
            // Check both directions since controls are one-way for simplicity
            document.querySelectorAll(`input[data-from="${e.from}"][data-to="${e.to}"], input[data-from="${e.to}"][data-to="${e.from}"]`)
                  .forEach(cb => cb.checked = true);
        });
    }

    function handleEdgeChange(from, to, isChecked) {
        // Ensure consistent ID (smaller-bigger)
        const edgeId = from < to ? `${from}-${to}` : `${to}-${from}`;
        if (isChecked && !edges.get(edgeId)) {
            edges.add({ id: edgeId, from, to });
        } else if (!isChecked && edges.get(edgeId)) {
            edges.remove(edgeId);
        }
        syncCheckboxesToGraph(); // Reflect undirected nature in all checkboxes
    }

    theoremSelect.addEventListener('change', () => {
        document.querySelectorAll('.theorem-description').forEach(d => d.classList.add('hidden'));
        document.getElementById(`theorem-${theoremSelect.value}-description`).classList.remove('hidden');
        
        const isRamsey = theoremSelect.value === 'ramsey_R33';
        numNodesInput.disabled = isRamsey;

        if (isRamsey && parseInt(numNodesInput.value, 10) !== 6) {
            numNodesInput.value = 6;
            setupNewGraph();
        } else {
            // Helpful UX: If switching to a tree theorem with a non-tree graph, generate a new tree
            const isTreeTheorem = ['unique_path', 'tree_edges', 'tree_center'].includes(theoremSelect.value);
            const { isTree } = analyzeGraphProperties();
            if (isTreeTheorem && !isTree) {
                generateRandomGraph();
            } else {
                runActiveTheorem();
            }
        }
    });
    
    numNodesInput.addEventListener('input', setupNewGraph);
    randomBtn.addEventListener('click', generateRandomGraph);

    connectionsContainer.addEventListener('change', (event) => {
        if (event.target.type === 'checkbox') {
            handleEdgeChange(parseInt(event.target.dataset.from), parseInt(event.target.dataset.to), event.target.checked);
            setTimeout(runActiveTheorem, 50); // Rerun analysis after manual change
        }
    });

    // --- INITIALIZE ---
    document.getElementById(`theorem-${theoremSelect.value}-description`).classList.remove('hidden');
    setupNewGraph();
});
