const photos = [
    {
        name: 'Node.js Logo',
        path: 'https://nodejs.org/static/images/logo.svg'
    }, {
        name: 'bar',
        path: 'https://nodejs.org/static/images/lfcp.png'
    }
];

exports.list = function (req, res) {
    console.log(res.locals)
    Object.assign(
        res.locals,
        {b:2}
    );
    res.render('photos', {
        title: 'Photos',
        photos: photos
    })
};

