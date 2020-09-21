import {extractComponents} from "./ConnectModal";

describe("Extract URL components should", () => {
    it('all defaults', () => {
        const {scheme, port, address} = extractComponents();
        expect(scheme).toEqual("neo4j")
        expect(port).toEqual(7687)
        expect(address).toEqual("localhost")
    })

    it('all correct', () => {
        const {scheme, port, address} = extractComponents("neo4j://demo.neo4jlabs.com:7688");
        expect(scheme).toEqual("neo4j")
        expect(port).toEqual(7688)
        expect(address).toEqual("demo.neo4jlabs.com")
    })

    it('incorrect scheme defaults to neo4j', () => {
        const {scheme, port, address} = extractComponents("blah://demo.neo4jlabs.com:7688");
        expect(scheme).toEqual("neo4j")
        expect(port).toEqual(7688)
        expect(address).toEqual("demo.neo4jlabs.com")
    })

    it('no port uses 7687', () => {
        const {scheme, port, address} = extractComponents("blah://demo.neo4jlabs.com");
        expect(scheme).toEqual("neo4j")
        expect(port).toEqual(7687)
        expect(address).toEqual("demo.neo4jlabs.com")
    })

    it('completely incorrect address uses defaults', () => {
        const {scheme, port, address} = extractComponents("localhost");
        expect(scheme).toEqual("neo4j")
        expect(port).toEqual(7687)
        expect(address).toEqual("localhost")
    })

    it('only protocol uses defaults for everything else', () => {
        const {scheme, port, address} = extractComponents("neo4j+s://");
        expect(scheme).toEqual("neo4j+s")
        expect(port).toEqual(7687)
        expect(address).toEqual("localhost")
    })

})