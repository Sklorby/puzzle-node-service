const shapeSetOne = [
  {
    id: 'p1-01-A2',
    isVisible: true,
    shapeUri: 'shapeA2-025',
  },
  {
    id: 'p1-01-A3',
    isVisible: true,
    shapeUri: 'shapeA3-026',
  },
  {
    id: 'p1-01-A4',
    isVisible: true,
    shapeUri: 'shapeA4-027',
  },
  {
    id: 'p1-02-A3',
    isVisible: true,
    shapeUri: 'shapeA3-028',
  },
];

const shapeSetTwo = [
  {
    id: 'p2-01-A1',
    isVisible: true,
    shapeUri: 'shapeA1-029',
  },
  {
    id: 'p2-02-A1',
    isVisible: true,
    shapeUri: 'shapeA1-030',
  },
  {
    id: 'p2-01-A4',
    isVisible: true,
    shapeUri: 'shapeA4-031',
  },
  {
    id: 'p2-01-A3',
    isVisible: true,
    shapeUri: 'shapeA3-032',
  },
];

const shapeSetThree = [
  {
    id: 'p3-01-A2',
    isVisible: true,
    shapeUri: 'shapeA2-033',
  },
  {
    id: 'p3-01-A1',
    isVisible: true,
    shapeUri: 'shapeA1-034',
  },
  {
    id: 'p3-02-A2',
    isVisible: true,
    shapeUri: 'shapeA2-035',
  },
  {
    id: 'p3-01-A4',
    isVisible: true,
    shapeUri: 'shapeA4-036',
  },
];

const shapeLevel2SetOne = [
  {
    id: 'p1-01-B2',
    isVisible: true,
    shapeUri: 'shapeB2-001',
  },
  {
    id: 'p1-02-B2',
    isVisible: true,
    shapeUri: 'shapeB2-002',
  },
  {
    id: 'p1-01-B3',
    isVisible: true,
    shapeUri: 'shapeB3-003',
  },
  {
    id: 'p1-02-B3',
    isVisible: true,
    shapeUri: 'shapeB3-004',
  },
  {
    id: 'p1-02-B5',
    isVisible: true,
    shapeUri: 'shapeB5-005',
  },
  {
    id: 'p1-02-B6',
    isVisible: true,
    shapeUri: 'shapeB6-006',
  },
];

const shapeLevel2SetTwo = [
  {
    id: 'p2-01-B1',
    isVisible: true,
    shapeUri: 'shapeB1-007',
  },
  {
    id: 'p2-02-B1',
    isVisible: true,
    shapeUri: 'shapeB1-008',
  },
  {
    id: 'p2-01-B4',
    isVisible: true,
    shapeUri: 'shapeB4-009',
  },
  {
    id: 'p2-01-B5',
    isVisible: true,
    shapeUri: 'shapeB5-010',
  },
  {
    id: 'p2-01-B6',
    isVisible: true,
    shapeUri: 'shapeB6-011',
  },
  {
    id: 'p2-02-B4',
    isVisible: true,
    shapeUri: 'shapeB4-012',
  },
];

const shapeLevel2SetThree = [
  {
    id: 'p3-01-B3',
    isVisible: true,
    shapeUri: 'shapeB3-013',
  },
  {
    id: 'p3-01-B1',
    isVisible: true,
    shapeUri: 'shapeB1-014',
  },
  {
    id: 'p3-01-B2',
    isVisible: true,
    shapeUri: 'shapeB2-015',
  },
  {
    id: 'p3-02-B3',
    isVisible: true,
    shapeUri: 'shapeB3-016',
  },
  {
    id: 'p3-01-B5',
    isVisible: true,
    shapeUri: 'shapeB5-017',
  },
  {
    id: 'p3-02-B5',
    isVisible: true,
    shapeUri: 'shapeB5-018',
  },
];

const shapeLevel2SetFour = [
  {
    id: 'p4-01-B4',
    isVisible: true,
    shapeUri: 'shapeB4-019',
  },
  {
    id: 'p4-01-B6',
    isVisible: true,
    shapeUri: 'shapeB6-020',
  },
  {
    id: 'p4-01-B1',
    isVisible: true,
    shapeUri: 'shapeB1-021',
  },
  {
    id: 'p4-01-B2',
    isVisible: true,
    shapeUri: 'shapeB2-022',
  },
  {
    id: 'p4-02-B4',
    isVisible: true,
    shapeUri: 'shapeB4-023',
  },
  {
    id: 'p4-02-B6',
    isVisible: true,
    shapeUri: 'shapeB6-024',
  },
];

const shape_sprites = [
  { name: 'shapeSetOne', shapeSetOne: shapeSetOne },
  { name: 'shapeSetTwo', shapeSetTwo: shapeSetTwo },
  { name: 'shapeSetThree', shapeSetThree: shapeSetThree },
];

const shape_sprites_level_2 = [
  { name: 'shapeSetOne', shapeSetOne: shapeLevel2SetOne },
  { name: 'shapeSetTwo', shapeSetTwo: shapeLevel2SetTwo },
  { name: 'shapeSetThree', shapeSetThree: shapeLevel2SetThree },
  { name: 'shapeSetFour', shapeSetThree: shapeLevel2SetFour },
];

module.exports = {
  shape_sprites,
  shape_sprites_level_2,
};

// const shapeSetThree1 = [
//   {
//     id: 'setThree-A1',
//     name: 'setThree-A1',
//     shape: 'triangle',
//     borderColor: 'transparent transparent #0074D9 transparent',
//     isVisible: true,
//     borderWidth: '0 50px 86.6px 50px',
//     transform: 'translateY(43.3px)',
//     vertices: [],
//   },
//   {
//     id: 'setThree-A2',
//     name: 'setThree-A2',
//     shape: 'triangle',
//     borderColor: 'transparent transparent #FF4136 transparent',
//     isVisible: true,
//     borderWidth: '0 90px 106.6px 10px',
//     transform: 'translateY(43.3px) rotate(180deg) translateY(-43.3px)',
//     vertices: [],
//   },
//   {
//     id: 'setThree-A3',
//     name: 'setThree-A3',
//     shape: 'triangle',
//     borderColor: 'transparent transparent #2ECC40 transparent',
//     isVisible: true,
//     borderWidth: '0 50px 86.6px 50px',
//     transform: 'translateY(43.3px) rotate(240deg) translateY(-43.3px)',
//     vertices: [],
//   },
//   {
//     id: 'setThree-A4',
//     name: 'setThree-A4',
//     shape: 'triangle',
//     borderColor: '#B10DC9 transparent transparent transparent',
//     isVisible: true,
//     borderWidth: '86.6px 50px 0 50px',
//     transform: '',
//     vertices: [],
//   },
// ];

// const shapeSetTwo1 = [
//   {
//     id: 'setTwo-A1',
//     name: 'setTwo-A1',
//     shape: 'triangle',
//     borderColor: 'transparent transparent #0074D9 transparent',
//     isVisible: true,
//     borderWidth: '0 50px 86.6px 50px',
//     transform: 'translateY(43.3px)',
//     vertices: [],
//   },
//   {
//     id: 'setTwo-A2',
//     name: 'setTwo-A2',
//     shape: 'triangle',
//     borderColor: 'transparent transparent #FF4136 transparent',
//     isVisible: true,
//     borderWidth: '0 90px 106.6px 10px',
//     transform: 'translateY(43.3px) rotate(180deg) translateY(-43.3px)',
//     vertices: [],
//   },
//   {
//     id: 'setTwo-A3',
//     name: 'setTwo-A3',
//     shape: 'triangle',
//     borderColor: 'transparent transparent #2ECC40 transparent',
//     isVisible: true,
//     borderWidth: '0 50px 86.6px 50px',
//     transform: 'translateY(43.3px) rotate(240deg) translateY(-43.3px)',
//     vertices: [],
//   },
//   {
//     id: 'setTwo-A4',
//     name: 'setTwo-A4',
//     shape: 'triangle',
//     borderColor: '#B10DC9 transparent transparent transparent',
//     isVisible: true,
//     borderWidth: '86.6px 50px 0 50px',
//     transform: '',
//     vertices: [],
//   },
// ];

// const shapeSetOne1 = [
//   {
//     id: 'setOne-A1',
//     name: 'setOne-A1',
//     shape: 'triangle',
//     borderColor: 'transparent transparent #0074D9 transparent',
//     isVisible: true,
//     borderWidth: '0 50px 86.6px 50px',
//     transform: 'translateY(43.3px)',
//     vertices: [],
//   },
//   {
//     id: 'setOne-A2',
//     name: 'setOne-A2',
//     shape: 'triangle',
//     borderColor: 'transparent transparent #FF4136 transparent',
//     isVisible: true,
//     borderWidth: '0 50px 86.6px 50px',
//     transform: 'translateY(43.3px) rotate(120deg) translateY(-43.3px)',
//     vertices: [],
//   },
//   {
//     id: 'settOne-A3',
//     name: 'settOne-A3',
//     shape: 'triangle',
//     borderColor: 'transparent transparent #2ECC40 transparent',
//     isVisible: true,
//     borderWidth: '0 50px 86.6px 50px',
//     transform: 'translateY(43.3px) rotate(240deg) translateY(-43.3px)',
//     vertices: [],
//   },
//   {
//     id: 'setOne-A4',
//     name: 'setOne-A4',
//     shape: 'triangle',
//     borderColor: '#B10DC9 transparent transparent transparent',
//     isVisible: true,
//     borderWidth: '86.6px 50px 0 50px',
//     transform: '',
//     vertices: [],
//   },
// ];
