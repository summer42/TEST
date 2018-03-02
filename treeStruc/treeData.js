const rawData = [
    {
        id: 1,
        parentId: "",
        name: "root"
    },
    {
        id: 11,
        parentId: 1,
        name: "a1"
    },
    {
        id: 12,
        parentId: 1,
        name: "a2"
    },
    {
        id: 111,
        parentId: 11,
        name: "a11"
    },
    {
        id: 112,
        parentId: 11,
        name: "a12"
    },
    {
        id: 121,
        parentId: 12,
        name: "a21"
    }
];

const processData = data => {
    console.log("rawData: ", data);
    let newList = [];
    //根元素
    let rootItemList = data.filter(x => !x.parentId);
    if (rootItemList && rootItemList.length) {
        newList.push(...rootItemList);
    } else {
        //没有根元素直接返回空数组
        return [];
    }
    // 对所有数据进行处理，赋予下级children
    const handleItemList = itemList => {
        itemList.forEach(x => {
            x.children = rawData.filter(item => item.parentId == x.id);
            if (x.children && x.children.length) {
                handleItemList(x.children);
            } else {
                return
            }
        });
        return itemList
    }
    let copyRawData = JSON.parse(JSON.stringify(rawData));
    const processedData = handleItemList(copyRawData);    
    //由根元素数组映射出含有children信息的itemList
    newList = newList.map(rootItem => processedData.find(proItem => proItem.id == rootItem.id));
    console.log("treeStructData: ", newList);
    return newList;
};

processData(rawData);