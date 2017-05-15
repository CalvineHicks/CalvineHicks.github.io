app.controller('NavController', function NavController($scope, $http) {
    $scope.categories = [{
        'title' : 'Wheelchairs & Accessories',
        'subCategories' : [
            {
                'title' : 'Wheelchairs',
                'queryString' : 'wheelchair'
            },
            {
                'title' : 'Transport Chairs',
                'queryString' : 'transport chair'
            },
             {
                 'title' : 'Electric Scooters',
                 'queryString' : 'electric scooter'
             }
        ]
    },
    {
        'title' : 'Hearing Assistance',
        'subCategories' : [
            {
                'title' : 'Hearing Aids',
                'queryString' : 'hearing aid'
            }
        ]
    },
    {
         'title' : 'Canes & Walkers',
         'subCategories' : [
             {
                 'title' : 'Adjustable Canes',
                 'queryString' : 'adjustable cane'
             },
             {
                'title' : 'Folding Canes',
                'queryString' : 'folding cane'
             },
             {
                 'title' : 'Wooden Canes',
                 'queryString' : 'wooden cane'
             },
            {
              'title' : 'Walkers',
              'queryString' : 'walker'
            }
         ]
    }
    ];
});