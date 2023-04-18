import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { TableVirtualScrollStrategy } from "./table-vs-strategy.service";

describe('TableVirtualScrollStrategy', () => {
    let service: TableVirtualScrollStrategy;
    let viewport: CdkVirtualScrollViewport;

    beforeEach(() => {
        service = new TableVirtualScrollStrategy();
        viewport = jasmine.createSpyObj("viewport", ["setTotalContentSize", "getDataLength", "scrollToOffset", "measureScrollOffset", "setRenderedContentOffset"]);
        service.setScrollHeight(52, 56);
    })

    it ('Should call all nested methods inside attach() method', () => {
        spyOn(service, "onDataLengthChanged");
        const updateContentSpy = spyOn(service as any, 'updateContent');
        
        service.attach(viewport);
    
        expect(service.onDataLengthChanged).toHaveBeenCalledTimes(1);
        expect(updateContentSpy).toHaveBeenCalledTimes(1);
        expect(updateContentSpy).toHaveBeenCalledWith(viewport);
    })

    it('Should call updateContent method', () => {
        const updateContentSpy = spyOn(service as any, 'updateContent');

        service.attach(viewport);
        service.onContentScrolled();

        expect(updateContentSpy).toHaveBeenCalledTimes(2);
    });

    it('Should call scrollToOffset on viewport', () => {
        service.attach(viewport);
        service.scrollToIndex(5, 'auto');

        expect(viewport.scrollToOffset).toHaveBeenCalledTimes(1);
    });


    it('Should call update viewport params and emit value to scrolledIndexChange stream', (done) => {
        viewport.measureScrollOffset = jasmine.createSpy().and.returnValue(0);

        service.scrolledIndexChange.subscribe((value: number) => {
            expect(value).toBe(0);
            done();
        })

        service.attach(viewport);
        spyOn(service as any, 'updateContent').and.callThrough();

        expect(viewport.measureScrollOffset).toHaveBeenCalled();
        expect(viewport.setRenderedContentOffset).toHaveBeenCalledTimes(1);
    });

    it('Should exit without any functions called if viewport hasn\'t been attached', () => {
        viewport.measureScrollOffset = jasmine.createSpy().and.returnValue(0);

        spyOn(service as any, 'updateContent').and.callThrough();

        expect(viewport.measureScrollOffset).not.toHaveBeenCalled();
        expect(viewport.setRenderedContentOffset).not.toHaveBeenCalled();
    })
});