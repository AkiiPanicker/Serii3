// static/js/theorem_script.js (Final Version with 14 Theorems/Algorithms)

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
        nodes: { 
            shape: 'circle', 
            borderWidth: 2, 
            font: { size: 16, color: '#343a40' } 
        },
        edges: {
            width: 2,
            arrows: { to: { enabled: false } }, // Default off, enabled as needed
            font: { align: 'top', color: '#0056b3', strokeWidth: 4, strokeColor: 'white' } // For Dijkstra's edge weights
        },
        physics: { enabled: true, solver: 'barnesHut' },
        interaction: { hover: true },
        manipulation: { enabled: false }
    };
    const network = new vis.Network(graphContainer, { nodes, edges }, options);


    // --- UTILITY & GRAPH ANALYSIS FUNCTIONS ---

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function resetAllStyles() {
        network.off('click'); // Remove any lingering click listeners
        const allNodeIds = nodes.getIds();
        if (allNodeIds.length > 0) {
            const nodeUpdates = allNodeIds.map(id => ({ id, color: null, label: `${id}`, shape: 'circle', hidden: false, font: {size: 16} }));
            nodes.update(nodeUpdates);
        }
        const allEdges = edges.get();
        if (allEdges.length > 0) {
            // Reset all visual properties, including labels for Dijkstra's
            const edgeUpdates = allEdges.map(edge => ({ id: edge.id, color: null, width: 2, dashes: false, hidden: false, arrows: { to: { enabled: false } }, label: null }));
            edges.update(edgeUpdates);
        }
    }

    function buildAdjacencyList() {
        const adj = nodes.getIds().reduce((acc, id) => { acc[id] = []; return acc; }, {});
        edges.get().forEach(edge => {
            adj[edge.from].push(edge.to);
            adj[edge.to].push(edge.from);
        });
        return adj;
    }

    function buildWeightedAdjacencyList() {
        const adj = nodes.getIds().reduce((acc, id) => { acc[id] = []; return acc; }, {});
        edges.get().forEach(edge => {
            const weight = parseInt(edge.label, 10) || 1; // Default to 1 if no weight
            adj[edge.from].push({ node: edge.to, weight: weight });
            adj[edge.to].push({ node: edge.from, weight: weight });
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
            const edgeUpdates = edges.get({ filter: e => edgeIds.includes(e.id) }).map(e => ({...e, color: 'red', width: 4}));
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
                    
                    edges.update({id: edgeId, hidden: true });
                    const { components } = analyzeGraphProperties(); 
                    
                    if (components.length === 2) {
                        nodes.update(components[0].map(id => ({ id, color: { background: '#ffc382' } })));
                        nodes.update(components[1].map(id => ({ id, color: { background: '#8ce2ff' } })));
                        
                        const m = components[0].length, n = components[1].length;
                        let proofHtml = `<h3>Proof Step:</h3><p>Removing edge <strong>${removedEdge.from}-${removedEdge.to}</strong> splits the tree into 2 components (sub-trees).</p>`;
                        proofHtml += `<p>Component 1 has <strong>m=${m}</strong> vertices and (by induction) <strong>m-1 = ${m-1}</strong> edges.</p>`;
                        proofHtml += `<p>Component 2 has <strong>n=${n}</strong> vertices and (by induction) <strong>n-1 = ${n-1}</strong> edges.</p>`;
                        proofHtml += `<p>Total edges = (m-1) + (n-1) + 1 (the removed edge) = ${m-1+n-1+1}, which equals <strong>p-1</strong> (${p-1}).</p>`;
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
        
        let currentNodes = new vis.DataSet(nodes.get());
        let currentEdges = new vis.DataSet(edges.get());
        let step = 1;
        
        while (currentNodes.length > 2) {
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
            await sleep(1500);
            
            const edgesToRemove = currentEdges.get({ filter: e => leaves.includes(e.from) || leaves.includes(e.to) });
            
            nodes.update(leaves.map(id => ({ id, hidden: true })));
            edges.update(edgesToRemove.map(e => ({ id: e.id, hidden: true })));
            
            currentNodes.remove(leaves);
            currentEdges.remove(edgesToRemove.map(e => e.id));
            await sleep(1000);
        }

        const centerNodes = currentNodes.getIds();
        stepsDiv.innerHTML += `<p><strong>Final Step:</strong> Process complete.</p>`;
        nodes.update(centerNodes.map(id => ({ id, hidden: false, shape: 'star', color: { background: '#ffcc80', border: '#ff9800' } })));
        
        const conclusion = centerNodes.length === 1 
            ? `The center is a single vertex: <strong>${centerNodes[0]}</strong>.` 
            : `The center is two adjacent vertices: <strong>${centerNodes.join(' and ')}</strong>.`;
        resultsContainer.innerHTML += `<div class="conclusion">${conclusion}</div>`;
    }

    /** Theorem 12: Eulerian Circuit */
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
                    
                    await sleep(600);
                    
                    edges.update({ id: edgeId, color: '#4caf50', width: 4, arrows: {to: {enabled: true, scaleFactor:1.2}}});
                    nodes.update({ id: v, color: { background: '#a4f5b3' }});

                    pathString += ` &rarr; ${v}`;
                    pathDisplay.innerHTML = pathString;
                }
                
                resultsContainer.innerHTML += `<div class="conclusion" style="margin-top: 15px;">Circuit Complete!</div>`;
                btn.style.display = 'none';
            });
        }
    }
    
    function findEulerianCircuit() {
        const adj = buildAdjacencyList();
        const nodeIds = nodes.getIds();
        if(nodeIds.length === 0) return null;
        let adjClone = {};
        for (const key in adj) { adjClone[key] = [...adj[key]]; }
    
        const startNode = nodeIds[0];
        let currPath = [startNode];
        let circuit = [];
    
        while (currPath.length > 0) {
            let u = currPath[currPath.length - 1];
            if (adjClone[u].length > 0) {
                let v = adjClone[u].pop();
                const v_index = adjClone[v].indexOf(u);
                if (v_index > -1) { adjClone[v].splice(v_index, 1); }
                currPath.push(v);
            } else {
                circuit.push(currPath.pop());
            }
        }
        return circuit.reverse();
    }
    
    /** NEW - Algorithm 13: Hamiltonian Circuit */
    function runHamiltonianAnalysis() {
        resetAllStyles();
        const adj = buildAdjacencyList();
        const nodeIds = nodes.getIds();
        const p = nodeIds.length;
        
        if (p < 3) {
            resultsContainer.innerHTML = `<h3>Results:</h3><p>A Hamiltonian circuit requires at least 3 vertices.</p>`;
            return;
        }

        // Set a reasonable limit for this NP-complete problem to avoid freezing the browser.
        if (p > 10) {
            resultsContainer.innerHTML = `<h3>Results:</h3><div class="conclusion" style="color: #d9534f;">Computationally Too Complex</div><p>Finding a Hamiltonian Circuit is an NP-complete problem. This tool automatically checks graphs with up to 10 vertices. Yours has ${p}.</p>`;
            return;
        }

        resultsContainer.innerHTML = '<h3>Results:</h3><p>Searching for a Hamiltonian Circuit... (this may take a moment)</p>';

        setTimeout(() => { // Give browser time to render "Searching..." message
            const { circuit, longestPath } = findHamiltonianCircuit(adj, nodeIds);

            if (circuit) {
                resultsContainer.innerHTML = `<h3>Results:</h3><div class="conclusion">Hamiltonian Circuit Found!</div><p>This graph contains a path that visits every node exactly once before returning to the start.</p><button id="show-circuit-btn" class="form-button">Animate Circuit</button>`;
                document.getElementById('show-circuit-btn').addEventListener('click', async (e) => {
                    e.target.disabled = true;
                    e.target.innerText = "Animating...";
                    await animatePath(circuit, true);
                    resultsContainer.innerHTML += `<div class="conclusion" style="margin-top:15px;">Animation Complete!</div>`;
                });
            } else {
                resultsContainer.innerHTML = `<h3>Results:</h3><div class="conclusion" style="color: #d9534f;">No Hamiltonian Circuit Found</div><p>There is no path that visits every node exactly once. The longest non-repeating path found is animated below.</p><button id="show-flawed-btn" class="form-button">Animate Longest Path</button>`;
                document.getElementById('show-flawed-btn').addEventListener('click', async (e) => {
                    e.target.disabled = true;
                    e.target.innerText = "Animating...";
                    await animatePath(longestPath, false);
                    if(longestPath.length > 0) {
                        nodes.update({ id: longestPath[longestPath.length - 1], color: { background: '#ff7b7b', border: '#d9534f' }});
                    }
                    resultsContainer.innerHTML += `<div class="conclusion" style="margin-top:15px; background-color: #d9534f;">Path gets stuck and cannot visit all nodes!</div>`;
                });
            }
        }, 50);
    }
    
    function findHamiltonianCircuit(adj, nodeIds) {
        let longestPath = [];

        function* solve(path, visited) {
            // Keep track of the longest path found during the search
            if (path.length > longestPath.length) {
                longestPath = [...path];
            }
            
            // If all nodes have been visited
            if (path.length === nodeIds.length) {
                const lastNode = path[path.length - 1];
                const startNode = path[0];
                // Check if it can return to the start to form a circuit
                if (adj[lastNode]?.includes(startNode)) {
                    yield [...path, startNode]; // SUCCESS: yield the full circuit
                }
                return; // End of this path
            }
            
            const u = path[path.length - 1]; // Current node
            for (const v of (adj[u] || [])) {
                if (!visited.has(v)) {
                    path.push(v);
                    visited.add(v);
                    yield* solve(path, visited); // Recurse
                    visited.delete(v); // Backtrack
                    path.pop();
                }
            }
        }
        
        // Try starting from each node to find a circuit
        for(const startNode of nodeIds) {
            const path = [startNode];
            const visited = new Set([startNode]);
            const generator = solve(path, visited);
            const result = generator.next();
            if (!result.done) {
                // Found a circuit, return it.
                return { circuit: result.value, longestPath: result.value }; 
            }
        }

        // If no circuit was found after trying all start nodes, return failure.
        return { circuit: null, longestPath }; 
    }

    async function animatePath(path, isCircuit) {
        resetAllStyles();
        if(!path || path.length === 0) {
            resultsContainer.innerHTML = `<h3>Error</h3><p>Could not find a path to animate.</p>`;
            return;
        };

        let pathString = `<strong>Path:</strong> ${path[0]}`;
        resultsContainer.innerHTML = `<p>${pathString}</p>`;
        
        nodes.update({ id: path[0], color: { background: '#a4f5b3', border: '#4caf50' }});

        for(let i=0; i<path.length - 1; i++) {
            await sleep(600);
            const u = path[i];
            const v = path[i+1];
            pathString += ` &rarr; ${v}`;
            resultsContainer.innerHTML = `<p>${pathString}</p>`;

            nodes.update({ id: v, color: { background: '#a4f5b3', border: '#4caf50' }});
            const edge = edges.get({filter: e => (e.from===u && e.to===v) || (e.from===v && e.to===u)})[0];
            if(edge) {
                edges.update({ id: edge.id, color: 'green', width: 4.5 });
            }
        }
        if(isCircuit) {
             resultsContainer.innerHTML = `<p>${pathString}</p><div class="conclusion">Returning to start... Complete!</div>`;
        }
    }


    /** NEW - Algorithm 14: Dijkstra's Shortest Path */
    function runDijkstraAnalysis() {
        resetAllStyles();
        const { isConnected } = analyzeGraphProperties();

        if (!isConnected) {
            resultsContainer.innerHTML = `<h3>Results:</h3><div class="conclusion" style="color: #d9534f;">Disconnected Graph</div><p>Dijkstra's algorithm requires a connected graph to find paths between all nodes.</p>`;
            return;
        }

        // Add random weights to edges if they don't have them
        const edgeUpdates = edges.get().map(edge => ({
            id: edge.id,
            label: String(Math.floor(Math.random() * 20) + 1)
        }));
        if(edgeUpdates.length > 0) edges.update(edgeUpdates);
        
        resultsContainer.innerHTML = `<h3>Dijkstra's Algorithm</h3><p>This algorithm finds the shortest path from a start node to all others. The edges have been given random weights.</p><div class="conclusion" style="background-color: #007bff">Click a node on the graph to set it as the START point!</div>`;
        
        network.once('click', async (params) => {
            if (params.nodes.length > 0) {
                const startNode = params.nodes[0];
                resultsContainer.innerHTML = `<h3>Running Dijkstra from Node ${startNode}...</h3><div id="dijkstra-steps"></div>`;
                await animateDijkstra(startNode);
            } else {
                 runDijkstraAnalysis(); // Reset if user clicks away from a node
            }
        });
    }

    async function animateDijkstra(startNode) {
        const adj = buildWeightedAdjacencyList();
        const nodeIds = nodes.getIds();
        const distances = {};
        const prev = {};
        const pq = new Set(nodeIds);

        nodeIds.forEach(id => {
            distances[id] = Infinity;
            prev[id] = null;
            nodes.update({id, color: {background: '#e0e0e0', border: '#a0a0a0'}, label: `${id}\n(∞)`});
        });
        distances[startNode] = 0;
        nodes.update({ id: startNode, color: { background: '#ffcc80', border: '#ff9800' }, label: `${startNode}\n(0)`});
        
        const stepsContainer = document.getElementById('dijkstra-steps');
        stepsContainer.innerHTML = `<p><strong>Step 0:</strong> Initialized all distances to infinity, start node to 0.</p>`;
        await sleep(2000);
        
        let step = 1;
        while(pq.size > 0) {
            let u = null;
            let minDistance = Infinity;
            for(const nodeId of pq) {
                if (distances[nodeId] < minDistance) {
                    minDistance = distances[nodeId];
                    u = nodeId;
                }
            }
            if(u === null || distances[u] === Infinity) break;

            pq.delete(u);

            nodes.update({ id: u, color: { background: '#ff7b7b', border: '#d9534f' }, font: {size: 22} }); // Highlight current node
            stepsContainer.innerHTML += `<p><strong>Step ${step++}:</strong> Visiting node <strong>${u}</strong> (shortest distance found so far: ${distances[u]}). Looking at its neighbors...</p>`;
            await sleep(1500);

            for(const { node: v, weight } of (adj[u] || [])) {
                if (pq.has(v)) {
                    const edgeId = u < v ? `${u}-${v}` : `${v}-${u}`;
                    edges.update({id: edgeId, color: 'orange', width: 3});
                    await sleep(800);

                    const alt = distances[u] + weight;
                    if(alt < distances[v]) {
                        distances[v] = alt;
                        prev[v] = u;
                        nodes.update({ id: v, label: `${v}\n(${alt})`, color: { background: '#8ce2ff' } }); // Light blue for "updated"
                        stepsContainer.innerHTML += `<div class="log-entry">→ Path to <strong>${v}</strong> via <strong>${u}</strong> is shorter! New distance: ${alt}.</div>`;
                    } else {
                         stepsContainer.innerHTML += `<div class="log-entry log-entry-nochange">→ Path to <strong>${v}</strong> via <strong>${u}</strong> (${distances[u]}+${weight}=${alt}) is not shorter.</div>`;
                    }
                    await sleep(1500);
                    edges.update({id: edgeId, color: null, width: 2});
                }
            }
            nodes.update({ id: u, color: { background: '#a4f5b3', border: '#4caf50' }, font: {size: 16} }); // Mark as visited (green)
        }

        stepsContainer.innerHTML += `<div class="conclusion" style="margin-top: 15px;">Algorithm Finished!</div><p>Highlighting the shortest path tree from node ${startNode}.</p>`;

        for (const nodeId of nodeIds) {
            if (nodeId === startNode || !prev[nodeId]) continue;
            let curr = nodeId;
            while(prev[curr]) {
                const p = prev[curr];
                const edgeId = p < curr ? `${p}-${curr}` : `${curr}-${p}`;
                edges.update({id: edgeId, color: '#007bff', width: 4.5});
                curr = p;
            }
        }
    }


    // --- MASTER CONTROL & EVENT LOGIC ---

    function runActiveTheorem() {
        resetAllStyles();
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
        else if (theorem === 'eulerian') runEulerianAnalysis();
        else if (theorem === 'hamiltonian') runHamiltonianAnalysis();
        else if (theorem === 'dijkstra') runDijkstraAnalysis();
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
        const theorem = theoremSelect.value;
        
        edges.clear();
        const newEdgesSet = new Set();
        let addedNodes = [];

        // Special generation logic for specific theorems
        if (['unique_path', 'tree_edges', 'tree_center'].includes(theorem)) {
            if (num > 0) addedNodes.push(1);
            for (let i = 2; i <= num; i++) {
                const connectToNode = addedNodes[Math.floor(Math.random() * addedNodes.length)];
                newEdgesSet.add(JSON.stringify({ id: `${Math.min(i, connectToNode)}-${Math.max(i, connectToNode)}`, from: i, to: connectToNode }));
                addedNodes.push(i);
            }
        } else if (theorem === 'hamiltonian') {
            if(num > 2) {
                let nodeList = nodes.getIds().sort(() => Math.random() - 0.5); // Shuffle nodes
                // Create the base Hamiltonian cycle
                for (let i = 0; i < num; i++) {
                    const u = nodeList[i];
                    const v = nodeList[(i + 1) % num];
                    newEdgesSet.add(JSON.stringify({ id: `${Math.min(u,v)}-${Math.max(u,v)}`, from: u, to: v }));
                }
                 // Add random "chord" edges to make it more interesting
                const maxExtraEdges = Math.floor(num * 0.5);
                for(let i=0; i<maxExtraEdges; i++){
                    let u = Math.floor(Math.random() * num) + 1;
                    let v = Math.floor(Math.random() * num) + 1;
                    if(u !== v) newEdgesSet.add(JSON.stringify({ id: `${Math.min(u,v)}-${Math.max(u,v)}`, from: u, to: v }));
                }
            }
        } else { // Standard or connected random graph for other cases
            let requiresConnection = ['dijkstra', 'min_degree_connect', 'diameter'].includes(theorem);
            // First, generate a spanning tree if connection is required to guarantee it
            if (requiresConnection && num > 1) {
                if (num > 0) addedNodes.push(1);
                for (let i = 2; i <= num; i++) {
                    const connectToNode = addedNodes[Math.floor(Math.random() * addedNodes.length)];
                    newEdgesSet.add(JSON.stringify({ id: `${Math.min(i, connectToNode)}-${Math.max(i, connectToNode)}`, from: i, to: connectToNode }));
                    addedNodes.push(i);
                }
            }
            // Then, add additional random edges
            const probability = requiresConnection ? 0.25 : 0.4;
            for (let i = 1; i <= num; i++) {
                for (let j = i + 1; j <= num; j++) {
                    if (Math.random() < probability) {
                        newEdgesSet.add(JSON.stringify({ id: `${i}-${j}`, from: i, to: j }));
                    }
                }
            }
        }

        const newEdges = Array.from(newEdgesSet).map(item => JSON.parse(item));
        if (newEdges.length > 0) edges.add(newEdges);
        syncCheckboxesToGraph();
        setTimeout(runActiveTheorem, 50);
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
                if (i === j) continue;
                list.innerHTML += `<label class="checkbox-item"><input type="checkbox" data-from="${i}" data-to="${j}">${j}</label>`;
            }
            group.appendChild(list);
            connectionsContainer.appendChild(group);
        }
    }

    function syncCheckboxesToGraph() {
        document.querySelectorAll('#connections-container input[type="checkbox"]').forEach(cb => cb.checked = false);
        edges.forEach(e => {
            document.querySelectorAll(`input[data-from="${e.from}"][data-to="${e.to}"], input[data-from="${e.to}"][data-to="${e.from}"]`)
                  .forEach(cb => cb.checked = true);
        });
    }

    function handleEdgeChange(from, to, isChecked) {
        const edgeId = from < to ? `${from}-${to}` : `${to}-${from}`;
        if (isChecked && !edges.get(edgeId)) {
            edges.add({ id: edgeId, from, to });
        } else if (!isChecked && edges.get(edgeId)) {
            edges.remove(edgeId);
        }
        syncCheckboxesToGraph();
    }

    theoremSelect.addEventListener('change', () => {
        document.querySelectorAll('.theorem-description').forEach(d => d.classList.add('hidden'));
        document.getElementById(`theorem-${theoremSelect.value}-description`).classList.remove('hidden');
        
        const isRamsey = theoremSelect.value === 'ramsey_R33';
        numNodesInput.disabled = isRamsey;

        if (isRamsey && parseInt(numNodesInput.value, 10) !== 6) {
            numNodesInput.value = 6;
            setupNewGraph();
            return; // Exit here after setting up the Ramsey graph
        }

        const isTreeTheorem = ['unique_path', 'tree_edges', 'tree_center'].includes(theoremSelect.value);
        const needsSpecialGraph = ['dijkstra', 'hamiltonian'].includes(theoremSelect.value);
        const { isTree, p } = analyzeGraphProperties();

        // If switching to a mode that needs a specially generated graph, do it.
        if ((isTreeTheorem && (!isTree || p < 2)) || needsSpecialGraph) {
             generateRandomGraph();
        } else {
            runActiveTheorem();
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
