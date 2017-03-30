Handlebars.registerHelper('pager', function (curPage, totalCount, pageSize) {
    totalCount = totalCount || 0;
    pageSize = pageSize || 50;
    var cur = curPage || 1,
        start, end, i,
        bef = false,
        aft = false,
        max = Math.ceil(totalCount / pageSize),
        end = max,
        canPre = cur > 1,
        canNext = cur < max,
        PAGE_TAG = 9;

    if (max <= PAGE_TAG) {
        start = 1;
    } else {
        start = cur - Math.floor(PAGE_TAG / 2);
        if (start <= 1) {
            start = 1;
        } else {
            bef = true;
        }
        end = start + PAGE_TAG - 1;
        if (end < max) {
            aft = true;
        } else {
            end = max;
        }
    }
    var data = {
        totalCount: totalCount,
        cur: cur,
        pages: [],
        bef: bef,
        aft: aft,
        max: max,
        canPre: canPre,
        canNext: canNext,
        pre: cur - 1,
        next: cur + 1
    };
    for (i = start; i <= end; i++) {
        data.pages.push({
            no: i,
            active: i === cur
        });
    }

    var tpl = '<div class="b-page-list clearfix">' +
        '<a href="#" class="btn sim-btn" {{#unless canPre}}disabled{{/unless}} cmd="page" {{#if canPre}}arg="{{pre}}"{{/if}}>上一页</a> ' +
        '{{#if bef}}<span>...</span> {{/if}}' +
        '{{#each pages}}<a href="#" class="btn sim-btn{{#if active}} active{{/if}}" cmd="page" arg="{{no}}">{{no}}</a> {{/each}}' +
        '{{#if aft}}<span>...</span> {{/if}}' +
        '<a href="#" class="btn sim-btn" {{#unless canNext}}disabled{{/unless}}  cmd="page" {{#if canNext}}arg="{{next}}"{{/if}}>下一页</a> ' +
        '<span class="padding-0-10">共{{totalCount}}条记录,分{{max}}页</span>' +
        '</div>';
    var pagerTpl = Handlebars.compile(tpl);
    return new Handlebars.SafeString(pagerTpl(data));
});

Handlebars.registerHelper('pageNum', function (index, pageIndex, pageSize) {
    pageIndex = pageIndex || 1;
    pageSize = pageSize || 0;
    return index + (pageIndex - 1) * pageSize + 1;
});

Handlebars.registerHelper('date', function (date, format) {
    if (!date)
        return '';
    return '' + date.getFullYear() + '-'
        + (date.getMonth() >= 9 ? '' : '0') + (date.getMonth() + 1)
        + '-' + (date.getDate() >= 10 ? '' : '0') + date.getDate();
    });

Handlebars.registerHelper('number', function (val, digits, format10000) {
    var num = parseFloat(val),
        unit = '';
    if (isNaN(num)) {
        return '';
    }
    var oriNum = num + '';
    if (format10000 === true) {
        if (num >= 10000) {
            num /= 10000;
            unit = '万';
        }
        return new Handlebars.SafeString('<span title="' + oriNum + '">' + $.number(num, digits || 0, '.', '') + unit + '</span>');
    }
    return $.number(num, digits || 0, '.', '');

});

Handlebars.registerHelper('rights', function (rights, options) {
    var req = rights.split(','),
        curr = Context.user.Rights;

    var success = _.every(req, function (right) {
        return curr.indexOf(right) != -1;
    });

    if (success) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

Handlebars.registerHelper('datetime', function (date, format) {
    if (!date) {
        return '';
    }
    var dateObj = new Date(date);
    if (isNaN(dateObj.getDay())) {
        return '';
    }
    var mm = dateObj.getMonth() + 1,
        dd = dateObj.getDate();
    HH = dateObj.getHours();
    MM = dateObj.getMinutes();
    //return dateObj.getFullYear() + '-' + (mm > 9 ? mm : '0' + mm) + '-' + (dd > 9 ? dd : '0' + dd) + '  ' + (HH > 9 ? HH : '0' + HH) + ':' + (MM > 9 ? MM : '0' + MM);
    return dateObj.getFullYear() + '-' + (mm > 9 ? mm : '0' + mm) + '-' + (dd > 9 ? dd : '0' + dd) ;
    //return $.format.date(date, format);
});
