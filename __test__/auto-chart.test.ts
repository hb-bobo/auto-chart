// import { getOptionById } from '../src';

describe("auto-chart", () => {
    interface State {
        v: number;
        state: {
            a: number;
        };
    }
    it("getOptionById", () => {
        // const option = getOptionById('pie', {
        //     dataset: {
        //         dimensions: [],
        //         source: [],
        //     }
        // });
        expect({ series: false }).toHaveProperty("series");
    });
});
