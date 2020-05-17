/**
 * date:2019/08/16
 * author:Mr.Chung
 * description:此处放layui自定义扩展
 */

window.rootPath = (function (src) {
    src = document.scripts[document.scripts.length - 1].src;
    return src.substring(0, src.lastIndexOf("/") + 1);
})();
layui.config({
    base: rootPath + "lay-module/",
    version: true
}).extend({
    // febs: 'febs/lay/modules/febs',
    // validate: 'febs/lay/modules/validate',

    layuimini: "layuimini/layuimini", // layuimini扩展
    step: 'step-lay/step', // 分步表单扩展
    treeTable: 'treetable-lay/treeTable', //table树形扩展
    tableSelect: 'tableSelect/tableSelect', // table选择扩展
    iconPickerFa: 'iconPicker/iconPickerFa', // fa图标选择扩展
    echarts: 'echarts/echarts', // echarts图表扩展
    echartsTheme: 'echarts/echartsTheme', // echarts图表主题扩展
    wangEditor: 'wangEditor/wangEditor', // wangEditor富文本扩展
    layarea: 'layarea/layarea', //  省市县区三级联动下拉选择器

    // PearAdmin
    pearTab:"PearAdmin/extends/pearTab",
    pearMenu:"PearAdmin/extends/pearMenu",
    pearOper:"PearAdmin/extends/pearOper",
    pearHash:"PearAdmin/extends/pearHash",
    pearAdmin:"PearAdmin/extends/pearAdmin",
    pearFrame:"PearAdmin/extends/pearFrame",
    pearSocial:"PearAdmin/extends/pearSocial",
    pearNotice:"PearAdmin/extends/pearNotice",
    pearStep:"PearAdmin/extends/pearStep",

    // Febs Admin
    apexcharts: 'febs/lay/extends/apexcharts.min',
}).define([], function (exports) {
    console.log("\n %c Erp_Web %c https://github.com/XiaoHuiHuiBlog %c 如果该项目对您有帮助的话，还请点个star给予精神支持！🐤", "color: #fff; font-size: .84rem;background: #366ed8; padding:5px 0;", "font-size: .84rem;background: #fff; border: 2px solid #b0e0a8;border-left: none; padding:3px 0;"," font-size: .84rem;background: #fcf9ec; padding:5px 0;margin-left: 8px");
    exports('index', {});
});
