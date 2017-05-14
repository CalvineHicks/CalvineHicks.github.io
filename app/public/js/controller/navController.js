app.controller('NavController', function NavController($scope, $http) {
    $scope.categories = ['Wheelchairs & Accessories', 'Hearing Assistance', 'Canes & Walkers'];
    $scope.subCategories = {
        'Wheelchairs & Accessories' : [
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
        ],
        'Hearing Assistance' : [
            {
                'title' : 'Hearing Aids',
                'queryString' : 'hearing aid'
            }
        ],
         'Canes & Walkers' : [
             {
                 'title' : 'Canes',
                 'queryString' : 'cane'
             },
             {
                'title' : 'Folding Canes',
                'queryString' : 'folding cane'
             },
            {
              'title' : 'Walkers',
              'queryString' : 'walker'
            }
         ]
    }
});