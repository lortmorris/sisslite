Date.prototype.addDays = function(days){
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}

Date.prototype.removeDays = function(days){
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() - days);
    return dat;
}

Date.prototype.explode = function(){
    var dat = new Date(this.valueOf());
    var Day = dat.getDate();
    Day = (""+Day).length==1 ? '0'+Day : Day;

    var Month = dat.getMonth()+1;
    Month = (""+Month).length == 1? '0'+Month : Month;

    var Year = dat.getFullYear();
    Year = (""+Year).length == 1 ? '0'+Year : Year;

    return {
        Year: Year
        ,Month: Month
        ,Day:Day
    }
}

Date.prototype.explodeUTC = function(){
    var dat = new Date(this.valueOf());
    var Day = dat.getUTCDate();
    Day = (""+Day).length==1 ? '0'+Day : Day;

    var Month = dat.getUTCMonth()+1;
    Month = (""+Month).length == 1? '0'+Month : Month;

    var Year = dat.getUTCFullYear();
    Year = (""+Year).length == 1 ? '0'+Year : Year;

    return {
        Year: Year
        ,Month: Month
        ,Day:Day
    }
}


Date.prototype.getNextDay = function(dayName){
    var _this = this;
    var dayWeek = 0;
    var currentDate = _this;

    switch(dayName){
        case 'monday':
            dayWeek = 1;
            break;
        case 'sunday':
        case '':
        default:
            dayWeek = 0;
    }

    if(currentDate.getDay()==dayWeek) currentDate = currentDate.addDays(1);

    while(currentDate.getDay()!=dayWeek) currentDate = currentDate.addDays(1);
    return currentDate;
}


Date.prototype.getNumberWeek = function(){
    var hoy = this;
    var month = hoy.getMonth()+1;
    var week=0;

    var cdate = hoy.getDate();

    for(var x=1; x<=cdate; x++){
        var day = (x+'').length==1 ? '0'+x : x;
        newDate = new Date(hoy.getFullYear()+'/'+month+'/'+day);
        if(newDate.getDay()==1) week++;
    }//end for
    return week == 0 ? 1: week;

}



Date.prototype.getMonthSpanishName = function(){
    var hoy = this;
    var month = hoy.getMonth()+1;
    var sreturn='NoN';

    switch(parseInt(month)){
        case 1: sreturn='Enero'; break;
        case 2: sreturn='Febrero'; break;
        case 3: sreturn='Marzo'; break;
        case 4: sreturn='Abril'; break;
        case 5: sreturn='Mayo'; break;
        case 6: sreturn='Junio'; break;
        case 7: sreturn='Julio'; break;
        case 8: sreturn='Agosto'; break;
        case 9: sreturn='Septiembre'; break;
        case 10: sreturn='Octubre'; break;
        case 11: sreturn='Noviembre'; break;
        case 12: sreturn='Diciembre'; break;

    }

    return sreturn;
}



Date.prototype.getFormatDate = function(addthis){
    var addthis=addthis||0;
    var date=this;
    date.setTime(date.getTime()+addthis);
    var day=date.getDate().toString().length==1?"0"+date.getDate().toString():date.getDate();
    var month=(date.getMonth()+1).toString().length==1?"0"+(date.getMonth()+1):date.getMonth()+1;
    return date.getFullYear()+"-"+month+"-"+day;
}

