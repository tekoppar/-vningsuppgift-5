class PageFetcher {
    static GPF = new PageFetcher();

    constructor() {
        this.requests = [];
        this.ProcessRequests();
    }

    AddRequest(callFunction, url) {
        this.requests.push({ callFunction: callFunction, url: url });
        this.ProcessRequests();
    }

    ProcessRequests() {
        for (let i = 0; i < this.requests.length; i++) {
            this.FetchPage(this.requests[i]);
        }

        this.requests = [];
    }

    FetchPage(request) {
        let page = new XMLHttpRequest();
        var newRequest = {CF:request.callFunction, url: request.url};
        page.open("GET", newRequest.url);
        page.onreadystatechange = function () {
            if (page.readyState === 4) {
                if (page.status === 200 || page.status == 0) {
                    newRequest.CF(page.response);
                }
            }
        }
        page.send();
    }
}

export { PageFetcher };