const Load = () => {
    return new Promise(async (res) => {
        const p1Data = await (await fetch('./images/player1/spritesheet.json')).json();
        const p2Data = await (await fetch('./images/player2/spritesheet.json')).json();
        const dummyData = await (await fetch('./images/dummy/spritesheet.json')).json();

        for(let prop in p1Data) {
            let image = new Image();
            image.src = `./images/player1/${p1Data[prop].src}`;
            await image.decode();
            p1Data[prop].src = image;
        }

        for(let prop in p2Data) {
            let image = new Image();
            image.src = `./images/player2/${p2Data[prop].src}`;
            await image.decode();
            p2Data[prop].src = image;
        }

        for(let prop in dummyData) {
            let image = new Image();
            image.src = `./images/dummy/${dummyData[prop].src}`;
            await image.decode();
            dummyData[prop].src = image;
        }
        let backgroundImage = new Image();
        backgroundImage.src = "./images/background.png"
        await backgroundImage.decode();

        let dummy = new Image();
        dummy.src = "./images/dummy.png"
        await dummy.decode();

        res({"player1": p1Data, "player2": p2Data, "background": {src: backgroundImage}, "dummy": dummyData})
    })
}

export default Load;