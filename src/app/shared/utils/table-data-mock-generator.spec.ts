import { generateMockTableData } from './table-data-mock-generator';

describe('generateMockTableData', () => {
  it('Should return empty data array and correct ammount of columns on 0 data points requested', () => {
    const generatedData = generateMockTableData(0, 5);

    expect(generatedData.columns.length).toBe(287);
    expect(generatedData.data).toEqual([]);
  });

  it('Should return 50 data points', () => {
    const generatedData = generateMockTableData(50, 30);

    expect(generatedData.data.length).toBe(50);
  });

  it('Should return certain text for some data item', () => {
    const elementNumber = 30;
    const generatedData = generateMockTableData(50, 30);
    const anyColumnDataKey: string = Object.values(generatedData.data[elementNumber])[0];

    expect(anyColumnDataKey).toBe('Detail 31');
  });
});
