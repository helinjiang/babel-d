export default function sayHello(name) {

  let target = {
    age: 12,
    desc: 'i like desc'
  };

  let result = { ...target };

  result.tName = name;

  let { tName } = result;

  const wording = `Hello, ${tName}!`;

  result = Object.assign({}, result, {
    wording
  });

  console.log(`Hello, ${name}!`, result);
}

sayHello('world');