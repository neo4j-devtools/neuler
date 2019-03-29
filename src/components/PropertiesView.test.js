import {extractHiddenProperties} from './PropertiesView';

describe("Properties View should", () => {
    it('returns empty array if no hidden properties', () => {
        expect(extractHiddenProperties(["Character"], {})).toEqual([])
    })

    it('extracts properties by label', () => {
        const hiddenPropertiesMap = {"Character": ["foo", "bar"]};
        expect(extractHiddenProperties(["Character"], hiddenPropertiesMap)).toEqual(["foo", "bar"])
    })

    it('extracts global properties', () => {
        const hiddenPropertiesMap = {"Character": ["foo", "bar"], "_ALL_NEULER_": ["degree"]};
        expect(extractHiddenProperties(["Character"], hiddenPropertiesMap)).toEqual(["foo", "bar", "degree"])
    })

    it('none of the properties are for our labels', () => {
        const hiddenPropertiesMap = {"Character": ["foo", "bar"], "Movie": ["abc", "def"]};
        expect(extractHiddenProperties(["SpecialLabel"], hiddenPropertiesMap)).toEqual([])
    })

})