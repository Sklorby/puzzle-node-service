
const shapeSetOne = [
    {
      id: "blue",
      name: "setOne-A1",
      shape: "triangle",
      borderColor: "transparent transparent #0074D9 transparent",
      isVisible: true,
      borderWidth: "0 50px 86.6px 50px",
      transform: "translateY(43.3px)",
      vertices: [],
    },
    {
      id: "red",
      name: "setOne-A2",
      shape: "triangle",
      borderColor: "transparent transparent #FF4136 transparent",
      isVisible: true,
      borderWidth: "0 50px 86.6px 50px",
      transform: "translateY(43.3px) rotate(120deg) translateY(-43.3px)",
      vertices: [],
    },
    {
      id: "green",
      name: "settOne-A3",
      shape: "triangle",
      borderColor: "transparent transparent #2ECC40 transparent",
      isVisible: true,
      borderWidth: "0 50px 86.6px 50px",
      transform: "translateY(43.3px) rotate(240deg) translateY(-43.3px)",
      vertices: [],
    },
    {
      id: "purple",
      name: "setOne-A4",
      shape: "triangle",
      borderColor: "#B10DC9 transparent transparent transparent",
      isVisible: true,
      borderWidth: "86.6px 50px 0 50px",
      transform: "",
      vertices: [],
    },
  ];

  const shapeSetTwo = [
    {
      id: "blue",
      name: "setTwo-A1",
      shape: "triangle",
      borderColor: "transparent transparent #0074D9 transparent",
      isVisible: true,
      borderWidth: "0 50px 86.6px 50px",
      transform: "translateY(43.3px)",
      vertices: [],
    },
    {
      id: "red",
      name: "setTwo-A2",
      shape: "triangle",
      borderColor: "transparent transparent #FF4136 transparent",
      isVisible: true,
      borderWidth: "0 90px 106.6px 10px",
      transform: "translateY(43.3px) rotate(180deg) translateY(-43.3px)",
      vertices: [],
    },
    {
      id: "green",
      name: "setTwo-A3",
      shape: "triangle",
      borderColor: "transparent transparent #2ECC40 transparent",
      isVisible: true,
      borderWidth: "0 50px 86.6px 50px",
      transform: "translateY(43.3px) rotate(240deg) translateY(-43.3px)",
      vertices: [],
    },
    {
      id: "purple",
      name: "setTwo-A4",
      shape: "triangle",
      borderColor: "#B10DC9 transparent transparent transparent",
      isVisible: true,
      borderWidth: "86.6px 50px 0 50px",
      transform: "",
      vertices: [],
    },
  ];

  const shapeSetThree = [
    {
      id: "blue",
      name: "setThree-A1",
      shape: "triangle",
      borderColor: "transparent transparent #0074D9 transparent",
      isVisible: true,
      borderWidth: "0 50px 86.6px 50px",
      transform: "translateY(43.3px)",
      vertices: [],
    },
    {
      id: "red",
      name: "setThree-A2",
      shape: "triangle",
      borderColor: "transparent transparent #FF4136 transparent",
      isVisible: true,
      borderWidth: "0 90px 106.6px 10px",
      transform: "translateY(43.3px) rotate(180deg) translateY(-43.3px)",
      vertices: [],
    },
    {
      id: "green",
      name: "setThree-A3",
      shape: "triangle",
      borderColor: "transparent transparent #2ECC40 transparent",
      isVisible: true,
      borderWidth: "0 50px 86.6px 50px",
      transform: "translateY(43.3px) rotate(240deg) translateY(-43.3px)",
      vertices: [],
    },
    {
      id: "purple",
      name: "setThree-A4",
      shape: "triangle",
      borderColor: "#B10DC9 transparent transparent transparent",
      isVisible: true,
      borderWidth: "86.6px 50px 0 50px",
      transform: "",
      vertices: [],
    },
  ];

const shape_sprites = [{'name': 'shapeSetOne', 'shapeSetOne':shapeSetOne}, {'name': 'shapeSetTwo','shapeSetTwo':shapeSetTwo}, {'name': 'shapeSetThree','shapeSetThree':shapeSetThree}];

module.exports = {
    shape_sprites
}