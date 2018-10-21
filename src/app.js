import './assets/scss/main.scss'

import angular from 'angular'
import axios from 'axios'

let mainApp = angular.module("mainApp", [])


mainApp.controller('MainController', ['$scope', function ($scope) {
    $scope.data = []
    $scope.date = ''
    $scope.guest = 2;

    $scope.selectedTime = ''
    $scope.selectedMonth = ''
    $scope.selectedMonthString = ''
    $scope.selectedYear = ''
    $scope.selectedDay = ''

    $scope.currentDate = 0;

    $scope.days = []

    $scope.guestSelect = [
        1,2,3,4,5
    ]

    function daysInMonth(month,year) {
        let monthNum =  new Date(Date.parse(month +" 1,"+year)).getMonth()+1
        return new Date(year, monthNum, 0).getDate();
    }
    function getMonthString(id) {
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        return monthNames[id]
    }

    function setDaysInMonth() {
        $scope.days = [];

        for(let i = 1; i <= daysInMonth($scope.selectedMonth, $scope.selectedYear); i++) {
            $scope.days.push(i)
        }
    }

    function setSelectedDate(date = null) {
        let now = (date == null ) ? new Date() : date
        let day = ('0' + now.getDate()).substr(-2)
        let month = ('0' + (now.getMonth()+1)).substr(-2)
        let year = now.getFullYear()

        $scope.currentDate = now
        $scope.selectedDay = day
        $scope.selectedMonth = month
        $scope.selectedMonthString = getMonthString(now.getMonth())
        $scope.selectedYear = year
        $scope.date = `${year}-${month}-${day}`

        setDaysInMonth()
    }

    $scope.toggleOpen = (selector) => {
        let el = document.querySelector(selector);

        if(el) {
            el.classList.toggle('open')
        }
    }

    $scope.checkedDate = () => {
        let now = new Date()
        let day = ('0' + now.getDate()).substr(-2)
        let month = ('0' + (now.getMonth()+1)).substr(-2)
        let year = now.getFullYear()

        return (day === $scope.selectedDay && month === $scope.selectedMonth && year === $scope.selectedYear)?  'Today' : `${$scope.selectedDay} ${$scope.selectedMonthString}`
    }

    $scope.getMarginDayCalendar = (day) => {
        let date = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth(), 1)
        let d = (date.getDay() - 1)
        let m = 40 * d
        if(day === 1 && d !== 7) return m + 'px'
        else 0
    }

    $scope.clickNextMonth = () => {
        let date = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth() + 1, 1)
        console.log('next', date)

        setSelectedDate(date);
    }

    $scope.clickPrevMonth = () => {
        let date = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth() - 1, 1)

        console.log('prev', date)
        setSelectedDate(date);
    }

    $scope.clickDay = (day) => {
        let date = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth(), day)

        setSelectedDate(date);
    }

    this.$onInit = () => {
        setSelectedDate()

        setDaysInMonth()

        $scope.onClickDay($scope.selectedDay)
    }

    $scope.save = () => {
        alert('thanks you')
    }
    $scope.setData = (data) => {
        $scope.data = data
    }

    $scope.setTime = (time) => {
        $scope.selectedTime = time
    }

    $scope.getValidTime = (time) => {
        return time.time.substr(0,5)
    }

    $scope.getData = () => {
        return $scope.data
    }

    $scope.onClickDay = (day) => {
        $scope.clickDay(day)

        axios.get(`https://hostme-services-qa.azurewebsites.net/api/core/mb/restaurants/4531/availability?date=${$scope.date}T12:00:00%2B03:00&partySize=2&rangeInMinutes=720`)
            .then(res => {
                $scope.$apply(function () {
                   $scope.data = res.data
                });
            })
    }
}])
