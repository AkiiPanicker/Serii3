// static/js/theorem_script.js (Final Version with 8 Theorems)

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
        edges: { width: 2 },
        physics: { enabled: true, solver: 'barnesHut' },
        interaction: { hover: true },
        manipulation: { enabled: false }
    };
    const network = new vis.Network(graphContainer, { nodes, edges }, options);


    // --- UTILITY & HELPER FUNCTIONS ---

    function resetAllStyles() {
        const allNodeIds = nodes.getIds();
        if (allNodeIds.length > 0) {
            const nodeUpdates = allNodeIds.map(id => ({ id, color: null, label: `${id}` }));
            nodes.update(nodeUpdates);
        }
        const allEdges = edges.get();
        if (allEdges.length > 0) {
            const edgeUpdates = allEdges.map(edge => ({ id: edge.id, color: null, width: 2 }));
            edges.update(edgeUpdates);
        }
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

    function buildAdjacencyList() {
        const adj = nodes.getIds().reduce((acc, id) => { acc[id] = []; return acc; }, {});
        edges.get().forEach(edge => {
            adj[edge.from].push(edge.to);
            adj[edge.to].push(edge.from);
        });
        return adj;
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


    // --- THEOREM ALGORITHMS ---

    /** Theorem 1: Vertices of Odd Degree */
    function runOddDegreeAnalysis() {
        resetAllStyles();
        let oddCount = 0;
        const nodesToUpdate = Object.entries(getDegrees()).map(([nodeId, degree]) => {
            const isOdd = degree % 2 !== 0;
            if (isOdd) oddCount++;
            return {
                id: Number(nodeId), label: `Deg: ${degree}`,
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
                id: Number(nodeId), label: `Group ${color}`,
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

    // --- MASTER CONTROL & EVENT LOGIC ---

    function runActiveTheorem() {
        const theorem = theoremSelect.value;
        if (theorem === 'odd_degree') runOddDegreeAnalysis();
        else if (theorem === 'bipartite') runBipartiteAnalysis();
        else if (theorem === 'ramsey_R33') runRamseyAnalysis();
        else if (theorem === 'self_complementary') runSelfComplementaryCheck();
        else if (theorem === 'diameter') runDiameterAnalysis();
        else if (theorem === 'sc_diameter') runSCDiameterAnalysis();
        else if (theorem === 'g_g_prime_connected') runConnectivityAnalysis();
        else if (theorem === 'min_degree_connect') runMinDegreeConnectivity();
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
        edges.clear();
        const newEdges = [];
        for (let i = 1; i <= num; i++) {
            for (let j = i + 1; j <= num; j++) {
                if (Math.random() < 0.4) newEdges.push({ id: `${i}-${j}`, from: i, to: j });
            }
        }
        edges.add(newEdges);
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
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        edges.forEach(e => {
            document.querySelectorAll(`input[data-from="${e.from}"][data-to="${e.to}"], input[data-from="${e.to}"][data-to="${e.from}"]`)
                  .forEach(cb => cb.checked = true);
        });
    }

    function handleEdgeChange(from, to, isChecked) {
        const edgeId = from < to ? `${from}-${to}` : `${to}-${from}`;
        if (isChecked && !edges.get(edgeId)) edges.add({ id: edgeId, from, to });
        else if (!isChecked && edges.get(edgeId)) edges.remove(edgeId);
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
        } else {
            runActiveTheorem();
        }
    });
    
    numNodesInput.addEventListener('input', setupNewGraph);
    randomBtn.addEventListener('click', generateRandomGraph);

    connectionsContainer.addEventListener('change', (event) => {
        if (event.target.type === 'checkbox') {
            handleEdgeChange(parseInt(event.target.dataset.from), parseInt(event.target.dataset.to), event.target.checked);
            setTimeout(runActiveTheorem, 50);
        }
    });

    // --- INITIALIZE ---
    document.getElementById(`theorem-${theoremSelect.value}-description`).classList.remove('hidden');
    setupNewGraph();
});
