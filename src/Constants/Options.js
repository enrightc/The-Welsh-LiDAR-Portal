// Site Type options 
export const siteOptions = [
    { value: '', label: '' },
    { value: 'enclosure', label: 'Enclosure' },
    { value: 'mound', label: 'Mound' },
    { value: 'field_system', label: 'Field system' },
    { value: 'settlement', label: 'Settlement' },
    { value: 'trackway', label: 'Trackway' },
    { value: 'industrial', label: 'Industrial' },
    { value: 'pit', label: 'Pit' },
    { value: 'bank', label: 'Bank' },
    { value: 'ditch', label: 'Ditch' },
    { value: 'other', label: 'Other' },
    { value: 'unknown', label: 'Unknown' },
];

// Monument options keyed by site type 
export const monumentOptions = {
  enclosure: [
    { value: 'banjo_enclosure', label: 'Banjo enclosure' },
    { value: 'curvilinear_enclosure', label: 'Curvilinear enclosure' },
    { value: 'defended_enclosure', label: 'Defended enclosure' },
    { value: 'causewayed_enclosure', label: 'Causewayed enclosure' },
    { value: 'rectilinear_enclosure', label: 'Rectilinear enclosure' },
    { value: 'hillfort', label: 'Hillfort' },
    { value: 'promontory_fort', label: 'Promontory fort' },
    ],
    mound: [
        { value: 'round_barrow', label: 'Round barrow' },
        { value: 'cairn', label: 'Cairn' },
        { value: 'platform_mound', label: 'Platform mound' },
        { value: 'burial_mound', label: 'Burial mound' },
    ],
    field_system: [
        { value: 'field_system', label: 'Field system' },
        { value: 'ridge_and_furrow', label: 'Ridge and furrow' },
        { value: 'lynchet', label: 'Lynchet' },
        { value: 'strip_field_system', label: 'Strip field system' },
    ],
    settlement: [
        { value: 'hillfort', label: 'Hillfort' },
        { value: 'roman_villa', label: 'Roman villa' },
        { value: 'farmstead', label: 'Farmstead' },
        { value: 'hamlet', label: 'Hamlet' },
        { value: 'deserted_medieval_village', label: 'Deserted medieval village' },
    ],
    trackway: [
        { value: 'hollow_way', label: 'Hollow way' },
        { value: 'trackway', label: 'Trackway' },
        { value: 'causeway', label: 'Causeway' },
    ],
    industrial: [
        { value: 'tramway', label: 'Tramway' },
        { value: 'quarry', label: 'Quarry' },
        { value: 'mine_shaft', label: 'Mine shaft' },
        { value: 'leat', label: 'Leat' },
        { value: 'mill', label: 'Mill' },
    ],
    pit: [
        { value: 'quarry_pit', label: 'Quarry pit' },
        { value: 'extraction_pit', label: 'Extraction pit' },

    ],
    bank: [
        { value: 'boundary_bank', label: 'Boundary bank' },
        { value: 'defensive_bank', label: 'Defensive bank' },
        { value: 'field_boundary', label: 'Field boundary' },
    ],
    ditch: [
        { value: 'defensive_ditch', label: 'Defensive ditch' },
        { value: 'drainage_ditch', label: 'Drainage ditch' },
        { value: 'boundary_ditch', label: 'Boundary ditch' },
    ],
    other: [
        { value: 'earthwork', label: 'Earthwork' },
        { value: 'cropmark', label: 'Cropmark' },
        { value: 'structure', label: 'Structure (undefined)' },
        { value: 'other', label: 'Other' },
    ],
    unknown: [
        { value: 'unknown', label: 'Unknown' },
    ],
};

const periodOptions = [
    { value: 'neolithic', label: 'Neolithic' },
    { value: 'bronze_age', label: 'Bronze Age' },
    { value: 'iron_age', label: 'Iron Age' },
    { value: 'roman', label: 'Roman' },
    { value: 'medieval', label: 'Medieval' },
    { value: 'post_medieval', label: 'Post Medieval' },
    { value: 'modern', label: 'Modern' },
    { value: 'unknown', label: 'Unknown' },
  ];