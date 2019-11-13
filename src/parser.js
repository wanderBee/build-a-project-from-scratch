const sander = require('sander');
const path = require('path');
const acorn = require('acorn');
const walk = require('acorn-walk');

sander.readFile(path.resolve('src/original.js')).then(function(buffer) {
	let source = buffer.toString();
	let ast = acorn.parse(source);

	let replaceNodes = [];
	walk.simple(ast, {
		BinaryExpression(node) {
			// console.log(
			// 	`[scratch]>>> Found a BinaryExpression: ${JSON.stringify(node)} ${node.left.value} ${node.operator} ${
			// 		node.right.value
			// 	}`
			// );
			let math_value = arithmetic(node.operator, node.left.value, node.right.value);
			if (math_value) {
				replaceNodes.push({
					pos_start: node.start,
					pos_end: node.end,
					raw: `${node.left.value} ${node.operator} ${node.right.value}`,
					math_value: math_value,
				});
			}
		},
	});
	console.log('[scratch]>>> structure for replacement in source code：\r\n', replaceNodes);
});

function arithmetic(operator, left, right) {
	try {
		switch (operator) {
			case '+':
				return left + right;
			case '-':
				return left - right;
			case '*':
				return left * right;
			case '/':
				return left / right;
			default:
				return null;
		}
	} catch (err) {
		return null;
	}
}
