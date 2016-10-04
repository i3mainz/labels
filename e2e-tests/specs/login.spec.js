'use strict';

describe("Component: login", function() {

    beforeEach(function() {
        //browser.manage().deleteAllCookies();
        browser.get(browser.baseUrl + "#/admin/login");
    });

    afterEach(function() {
        browser.manage().deleteAllCookies();
    });

    it("should have a title", function() {
        expect(browser.getTitle()).toEqual('Labeling System');
    });

    it("should have the login panel", function() {
        var panel = element(by.css('.center'));

        expect(panel.isPresent()).toBeTruthy();
        expect(panel.element(by.css("h3")).getText()).toEqual("Labeling System Editor");
    });

    it("should unlock login button when user/pw entered", function() {
        var button = element(by.css('.deletebutton'));

        expect(button.getAttribute("class")).toContain("inactive");

        // providing username and password should remove class 'inactive'
        element(by.model("username")).sendKeys("John Doe");
        element(by.model("password")).sendKeys("some password");

        expect(button.getAttribute('class')).not.toContain("inactive");
    });

    it("should redirect to vocabs on successful login", function() {
        element(by.model("username")).sendKeys("demo");
        element(by.model("password")).sendKeys("demo");
        element(by.css('button.deletebutton')).click();

        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + "#/admin/vocabularies");
    });

    // it("should redirect to vocabs if already logged in", function() {
    //     element(by.model("username")).sendKeys("demo");
    //     element(by.model("password")).sendKeys("demo");
    //     element(by.css('button.deletebutton')).click();
    //
    //     // access login page when already logged in
    //     browser.get(browser.baseUrl + "#/admin/login");
    //
    //     expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + "#/admin/vocabularies");
    //
    // });

});
