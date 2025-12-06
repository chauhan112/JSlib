import { SearchType } from "./model";
import { FilterUICtrl } from "./ui";
import { Filter } from "./model";
import { GlobalStates } from "../../../june/domain-ops/GlobalStates";

export const UiParamsMap = (params: { type: SearchType; params: any }[]) => {
    let res: any = [];
    for (const sfilter of params) {
        if (sfilter.type === SearchType.ValStringSearch) {
            sfilter.params = {
                ...sfilter.params,
                word: sfilter.params.search,
            };
        } else if (sfilter.type === SearchType.LocSearch) {
            sfilter.params.params.word = sfilter.params.params.search;
        } else if (sfilter.type === SearchType.KeyValSearch) {
            sfilter.params = {
                ...sfilter.params.params,
                key: sfilter.params.key,
            };
            sfilter.params.word = sfilter.params.search;
        }
        res.push(sfilter);
    }
    return res;
};
export const SearchCtrl = () => {
    const filterCtrl = FilterUICtrl();

    const states = {
        setResult: (res: any) => {},
        getData: () => {
            return {};
        },
    };
    const searchIt = (params: { type: SearchType; params: any }[]) => {
        let res = Filter.ArrayConcatSearch(
            UiParamsMap(params),
            states.getData() as any
        );
        let modal = GlobalStates.getInstance().getState("modal");
        modal.s.handlers.hide();
        states.setResult(res);
    };

    const setup = () => {
        filterCtrl.setup();
        filterCtrl.states.onSearch = searchIt;
    };

    return { states, filterCtrl, setup, searchIt };
};