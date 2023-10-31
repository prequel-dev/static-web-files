var inputDataGlobal = {};
var data_forflamegraph = {};

function fetchAndParseData(url, callback) {

	console.debug("url value: " + url)
    // Fetch the data
	fetch(url)
	.then(response => response.text())
    .then(data => {

        // Convert text to json
        const stackTracedata = [];
        const regex = /Stack Trace: ([\s\S]*?)\n\n\nSamples: (\d+)/g;
        let match;

        while (match = regex.exec(data)) {
            const trace = match[1].trim().replace(/\n/g, '');
            const count = parseInt(match[2], 10);
            stackTracedata.push({ trace, count });
        }

        const result = { stackTracedata };
		inputDataGlobal = result;

		console.debug("Initial JSON version of input: " + JSON.stringify(inputDataGlobal));
		
		// Convert to target json for js library
        processData();

		console.debug("Target JSON version of input: " + JSON.stringify(data_forflamegraph));

		callback();

    })
    .catch(error => {
        console.error("Error fetching and parsing data:", error);
    });
}

function processData() {

/* test data 
	inputDataGlobal = {
		"stackTraceData": [
		{ "trace": "FunctionA;FunctionB;FunctionC", "count": 5 },
		{ "trace": "FunctionA;FunctionB;FunctionD", "count": 3 },
		{ "trace": "FunctionA;FunctionE", "count": 8 }
		]
	};
*/

	const stackTraceData = inputDataGlobal["stackTracedata"];
	console.debug("Data before conversion: " + JSON.stringify(stackTraceData));
	
	const tree = {
		name: 'Root',
		value: 0,
		children: []
	};
  
	function findOrCreateChild(node, name) {
			for (const child of node.children) {
				if (child.name === name) {
					return child;
				}
			}
	
		const newChild = {
			name: name,
			value: 0,
			children: []
		};
		node.children.push(newChild);
		return newChild;
  	}
  
	function insertIntoTree(tree, stackTrace, count) {
		let currentNode = tree;
	
		for (let i = 0; i < stackTrace.length; i++) {
			const frame = stackTrace[i];
	
			let childNode = findOrCreateChild(currentNode, frame);
	
			// Increment the value for every node in the trace
			childNode.value += count;
	
			currentNode = childNode;
		}
	}
  
	for (let { trace, count } of stackTraceData) {
		const stackTrace = trace.split(';');
		console.log("a stack trace to split:" + JSON.stringify(stackTrace));
		insertIntoTree(tree, stackTrace, count);
	}
	
	const output = {
		children: tree.children
	};
  
  	console.debug("converted to target format: " + JSON.stringify(output));
  
	data_forflamegraph = output;

	return output;

}

function useTestData(scenario) {

	console.log("value of data_* before this function is called" + JSON.stringify(data_forflamegraph));

	//simple test input
	if (scenario == 1){


		data_forflamegraph = {
			"children": [
				{
					"name": "runtime.goexit.abi0.test",
					"value": 73347,
					"children": [
						{
							"name": "google.golang.org/grpc.(*Server).serveStreams.func1.2",
							"value": 73341,
							"children": [
								{
									"name": "google.golang.org/grpc.(*Server).handleStream",
									"value": 73341,
									"children": [
										{
											"name": "google.golang.org/grpc.(*Server).processUnaryRPC",
											"value": 73341,
											"children": []

										}
									]
								}
							]
						}
					]
				},
				{
					"name": "runtime.goexit.abi0,test2",
					"value": 73347,
					"children": [
						{
							"name": "google.golang.org/grpc.(*Server).serveStreams.func1.2",
							"value": 73341,
							"children": [
								{
									"name": "google.golang.org/grpc.(*Server).handleStream",
									"value": 73341,
									"children": [
										{
											"name": "google.golang.org/grpc.(*Server).processUnaryRPC",
											"value": 73341,
											"children": []

										}
									]
								}
							]
						}
					]
				},
				{
					"name": "runtime.goexit.abi0,test2",
					"value": 73347,
					"children": [
						{
							"name": "google.golang.org/grpc.(*Server).serveStreams.func1.2",
							"value": 73341,
							"children": [
								{
									"name": "google.golang.org/grpc.(*Server).handleStream",
									"value": 73341,
									"children": [
										{
											"name": "google.golang.org/grpc.(*Server).processUnaryRPC",
											"value": 73341,
											"children": []

										}
									]
								}
							]
						}
					]
				},
				{
					"name": "runtime.goexit.abi0,test2",
					"value": 73347,
					"children": [
						{
							"name": "google.golang.org/grpc.(*Server).serveStreams.func1.2",
							"value": 73341,
							"children": [
								{
									"name": "google.golang.org/grpc.(*Server).handleStream",
									"value": 73341,
									"children": [
										{
											"name": "google.golang.org/grpc.(*Server).processUnaryRPC",
											"value": 73341,
											"children": []

										}
									]
								}
							]
						}
					]
				}
			]
		};
 
	} // more complex test input
	else if (scenario == 2){

		data_forflamegraph = {"children":[{"name":"runtime.goexit.abi0","value":10000,"children":[{"name":"google.golang.org/grpc.(*Server).serveStreams.func1.2","value":10000,"children":[{"name":"google.golang.org/grpc.(*Server).handleStream","value":10000,"children":[{"name":"google.golang.org/grpc.(*Server).processUnaryRPC","value":10000,"children":[{"name":"github.com/opentelemetry/opentelemetry-demo/src/productcatalogservice/genproto/oteldemo._ProductCatalogService_ListProducts_Handler","value":10000,"children":[{"name":"go.opentelemetry.io/contrib/instrumentation/google.golang.org/grpc/otelgrpc.UnaryServerInterceptor.func1","value":10000,"children":[{"name":"github.com/opentelemetry/opentelemetry-demo/src/productcatalogservice/genproto/oteldemo._ProductCatalogService_ListProducts_Handler.func1","value":10000,"children":[{"name":"[m] /lib/ld-musl-x86_64.so.1 + 0x000495f0","value":10000,"children":[{"name":"runtime.sigtramp.abi0","value":10000,"children":[{"name":"runtime.sigtrampgo","value":10000,"children":[{"name":"runtime.sigfwdgo","value":10000,"children":[]}]}]}]}]}]}]}]}]}]}]}]};
  
	}
	
}

console.debug("app begins")
//grabbing scriptElement to be able to fed into modified version of incendiumFlamegraph
var scriptElement = document.currentScript;

if (window.Retool) {

	window.Retool.subscribe(function(model) {

		//useTestData (1);
		data_forflamegraph = model


		// Initiate the fetch and parsing process
		// fetchAndParseData('https://urban-invention-pxpw5jr94wrh9xrx-8080.app.github.dev/assets/testfile.text', () => {
		
		
		console.debug("value of data  ....:  " + JSON.stringify(data_forflamegraph));
		incendiumFlamegraph("hkctthqlqhcubcsgrazymmvaldzllxbq", data_forflamegraph, scriptElement);

    });

	
}
else {

	// Initiate the fetch and parsing process
	fetchAndParseData('assets/testfile.text', () => {
		
		console.debug("value of data after callback ....:  " + JSON.stringify(data_forflamegraph));
		incendiumFlamegraph("hkctthqlqhcubcsgrazymmvaldzllxbq", data_forflamegraph, scriptElement);

	});

}