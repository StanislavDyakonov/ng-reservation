import './assets/scss/main.scss'

import angular from 'angular'
import axios from 'axios'

let mainApp = angular.module("mainApp", [])

mainApp.service('store', () => {
    let times = [

    ]

    this._times = times

    return {
        getTimes: () => this._times,
        setTimes(value) {
            this._times = value;
        }
    };
});

mainApp.controller('MainController', ['$scope', ($scope) => {
    $scope.now = new Date()

}])

mainApp.controller('CalendarController', ['$scope', ($scope, store) => {
    $scope.data = [];
    let link = 'https://hostme-services-qa.azurewebsites.net/api/core/mb/restaurants/4531/availability?date=2018-10-30T12:00:00%2B03:00&partySize=2&rangeInMinutes=720'

    $scope.onClick = () => {

        axios.get(link)
            .then(res => {
                store.setTimes(res.data)
            })
    }
}])

mainApp.controller('TimesController', ['$scope', ($scope, store) => {
    $scope.times = store.getTimes()
}])
