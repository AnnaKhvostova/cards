
async function onSearchBookFormSubmit(event) {
    event.preventDefault();
    const {
        search: { value: searchValue },
    } = this.elements;
    // console.log(localStorage.getItem("data"));
    srv.request("GET", "posts").then((data) => {
        const resultArr = data.filter(
            ({ author, name, price }) =>
                author === searchValue ||
                name === searchValue ||
                price === searchValue
        );
        root.textContent = "";
        resultArr.forEach((bookData) => {
            const book = new Book(bookData);
            book.render();
        });
    });

    // const resultArr = [];
    // const authorRequest = await srv
    // 	.request("GET", `posts?author=${searchValue}`)
    // 	.then((data) => {
    // 		console.log(data);
    // 		resultArr.push(...data);
    // 	});
    // const nameRequest = await srv
    // 	.request("GET", `posts?name=${searchValue}`)
    // 	.then((data) => {
    // 		console.log(data);
    // 		resultArr.push(...data);
    // 	});
    // const priceRequest = await srv
    // 	.request("GET", `posts?price=${searchValue}`)
    // 	.then((data) => {
    // 		console.log(data);
    // 		resultArr.push(...data);
    // 	});
    // // console.log(resultArr);
    // const result = new Set(resultArr);
    // console.log(result);
}
