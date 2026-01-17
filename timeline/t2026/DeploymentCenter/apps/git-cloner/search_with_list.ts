import { SearchComponentCtrl } from "../../../../t2025/dec/DomainOpsFrontend/components/SearchComponent";
import { ListDisplayerCtrl } from "../../../../t2025/dec/DomainOpsFrontend/components/ListDisplayer";
import { SingleCrud } from "../../../../t2025/dec/DomainOpsFrontend/SingleCrud";
import { SearchType } from "../../../../t2025/july/generic-crud/search/model";
import { GlobalStates } from "../../../../t2025/june/domain-ops/GlobalStates";
import { MainCtrl as RouteWebPageMainCtrl } from "../../../../t2025/dec/DomainOpsFrontend/route/controller";

export class SearchWithList{
    comp: any;
    searchComponentCtrl: SearchComponentCtrl = new SearchComponentCtrl();
    listDisplayerCtrl: ListDisplayerCtrl = new ListDisplayerCtrl();
    on_card_clicked: (data: any) => void = (data: {title: string}) => {
        RouteWebPageMainCtrl.relative_navigate(`/view/${data.title}`);
    };
    setup() {
        this.comp.s.searchComp.s.plusIcon.update({class:"hidden"});
        this.comp.s.searchComp.s.searchButton.getElement().classList.add("cursor-pointer");
        this.searchComponentCtrl.set_comp(this.comp.s.searchComp);
        this.searchComponentCtrl.setup();
        this.listDisplayerCtrl.set_comp(this.comp.s.listDisplayer); 
        this.listDisplayerCtrl.setup();
        this.listDisplayerCtrl.update();
        this.listDisplayerCtrl.on_card_clicked = (data: any) => this.on_card_clicked(data);
        this.searchComponentCtrl.onSearch = (params: { type: SearchType; params: any }[]) => this.search(params);
        this.searchComponentCtrl.filterUICtrl.states.onSearch = (params: { type: SearchType; params: any }[]) => this.on_filter_search_clicked(params);
        this.listDisplayerCtrl.contextMenuOptions = []
    }

    
    on_filter_search_clicked(params: { type: SearchType; params: any }[]) {
        let modal = GlobalStates.getInstance().getState("modal");
        modal.s.handlers.display(this.searchComponentCtrl.filterUICtrl.comp);
        modal.s.handlers.hide();
        this.search(params)
    }
    search(params: { type: SearchType; params: any }[]) {
        let data = this.get_result_data(params);
        this.listDisplayerCtrl.set_data(data);
        this.listDisplayerCtrl.update();
    }
    get_result_data(params: { type: SearchType; params: any }[]) {
        return [{title: "file1", pageNr:1}, {title: "file2", pageNr:2}, {title: "file3", pageNr:3}, {title: "file4", pageNr:4}, {title: "file5", pageNr:5}];
    }
}

export class MainCtrl {
    static searchWithList() {
        const searchWithList = new SearchWithList();
        searchWithList.comp = SingleCrud();
        searchWithList.setup();
        return searchWithList;
    }
}