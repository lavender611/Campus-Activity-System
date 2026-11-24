# -*- coding: utf-8 -*-
import os
from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING, WD_TAB_ALIGNMENT
from docx.enum.section import WD_SECTION
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

OUT = r'C:\Users\chen\Desktop\CampusActivity_FullProject-6\CampusActivity_FullProject\doc\校园活动报名系统-答辩汇报材料.docx'
BODY_W = Cm(16.0)


def set_run(run, cn='宋体', en='Times New Roman', size=12, bold=False, color=(0, 0, 0)):
    run.font.name = en
    run.font.size = Pt(size)
    run.bold = bold
    run.font.color.rgb = RGBColor(*color)
    rPr = run._element.get_or_add_rPr()
    rFonts = rPr.find(qn('w:rFonts'))
    if rFonts is None:
        rFonts = OxmlElement('w:rFonts')
        rPr.append(rFonts)
    rFonts.set(qn('w:ascii'), en)
    rFonts.set(qn('w:hAnsi'), en)
    rFonts.set(qn('w:eastAsia'), cn)


def shade(el, color):
    tcPr = el.get_or_add_tcPr() if el.tag.endswith('tc') else el.get_or_add_pPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), color)
    tcPr.append(shd)


def body(text):
    p = doc.add_paragraph()
    p.paragraph_format.first_line_indent = Pt(24)
    p.paragraph_format.line_spacing = 1.5
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(0)
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    set_run(p.add_run(text), '宋体', 'Times New Roman', 12)
    return p


def h1(text):
    p = doc.add_paragraph(style='Heading 1')
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.line_spacing = 1.5
    p.paragraph_format.keep_with_next = True
    set_run(p.add_run(text), '黑体', 'Times New Roman', 16, True)
    return p


def h2(text):
    p = doc.add_paragraph(style='Heading 2')
    p.paragraph_format.space_before = Pt(11)
    p.paragraph_format.space_after = Pt(5)
    p.paragraph_format.line_spacing = 1.5
    p.paragraph_format.keep_with_next = True
    set_run(p.add_run(text), '黑体', 'Times New Roman', 14, True)
    return p


def h3(text):
    p = doc.add_paragraph(style='Heading 3')
    p.paragraph_format.space_before = Pt(9)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.5
    p.paragraph_format.keep_with_next = True
    set_run(p.add_run(text), '黑体', 'Times New Roman', 12, True)
    return p


def caption(text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.0
    p.paragraph_format.keep_with_next = True
    set_run(p.add_run(text), '宋体', 'Times New Roman', 10.5)
    return p


def code_block(lines):
    for line in lines:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        p.paragraph_format.line_spacing = 1.0
        p.paragraph_format.left_indent = Cm(0.6)
        p.paragraph_format.first_line_indent = Pt(0)
        shade(p._p, 'F2F2F2')
        set_run(p.add_run(line), '宋体', 'Consolas', 9)


def add_table(headers, rows, widths, aligns=None):
    ncol = len(headers)
    aligns = aligns or ['center'] + ['left'] * (ncol - 1)
    t = doc.add_table(rows=1, cols=ncol)
    t.style = 'Table Grid'
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    t.autofit = False
    # 边框
    tblPr = t._tbl.tblPr
    borders = OxmlElement('w:tblBorders')
    for edge in ('top', 'left', 'bottom', 'right', 'insideH', 'insideV'):
        b = OxmlElement('w:' + edge)
        b.set(qn('w:val'), 'single')
        b.set(qn('w:sz'), '4')
        b.set(qn('w:space'), '0')
        b.set(qn('w:color'), '000000')
        borders.append(b)
    tblPr.append(borders)

    # 表头
    hdr = t.rows[0]
    trPr = hdr._tr.get_or_add_trPr()
    trPr.append(OxmlElement('w:cantSplit'))
    trPr.append(OxmlElement('w:tblHeader'))
    for i, txt in enumerate(headers):
        cell = hdr.cells[i]
        cell.width = widths[i]
        cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
        shade(cell._tc, 'D9D9D9')
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.first_line_indent = Pt(0)
        p.paragraph_format.left_indent = Pt(0)
        p.paragraph_format.right_indent = Pt(0)
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.line_spacing = 1.0
        set_run(p.add_run(txt), '宋体', 'Times New Roman', 10.5, True)

    for row in rows:
        r = t.add_row()
        r._tr.get_or_add_trPr().append(OxmlElement('w:cantSplit'))
        for i, txt in enumerate(row):
            cell = r.cells[i]
            cell.width = widths[i]
            cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
            p = cell.paragraphs[0]
            p.alignment = {'left': WD_ALIGN_PARAGRAPH.LEFT,
                           'center': WD_ALIGN_PARAGRAPH.CENTER,
                           'right': WD_ALIGN_PARAGRAPH.RIGHT}[aligns[i]]
            p.paragraph_format.first_line_indent = Pt(0)
            p.paragraph_format.left_indent = Pt(0)
            p.paragraph_format.right_indent = Pt(0)
            p.paragraph_format.space_before = Pt(2)
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.line_spacing = 1.0
            set_run(p.add_run(str(txt)), '宋体', 'Times New Roman', 10.5)

    # 列宽落到网格
    for i, w in enumerate(widths):
        for cell in t.columns[i].cells:
            cell.width = w
    return t


def page_number_footer(section):
    footer = section.footer
    footer.is_linked_to_previous = False
    p = footer.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    fld = OxmlElement('w:fldSimple')
    fld.set(qn('w:instr'), ' PAGE ')
    r = OxmlElement('w:r')
    rPr = OxmlElement('w:rPr')
    rFonts = OxmlElement('w:rFonts')
    rFonts.set(qn('w:eastAsia'), '宋体')
    rFonts.set(qn('w:ascii'), 'Times New Roman')
    rPr.append(rFonts)
    sz = OxmlElement('w:sz')
    sz.set(qn('w:val'), '21')
    rPr.append(sz)
    r.append(rPr)
    t = OxmlElement('w:t')
    t.text = '1'
    r.append(t)
    fld.append(r)
    p._p.append(fld)


def toc_block():
    p = doc.add_paragraph()
    p.paragraph_format.line_spacing = 1.0
    fld = OxmlElement('w:fldSimple')
    fld.set(qn('w:instr'), 'TOC \\o "1-2" \\h \\z \\u')
    fld.set(qn('w:dirty'), 'true')
    r = OxmlElement('w:r')
    rPr = OxmlElement('w:rPr')
    rFonts = OxmlElement('w:rFonts')
    rFonts.set(qn('w:eastAsia'), '宋体')
    rPr.append(rFonts)
    r.append(rPr)
    t = OxmlElement('w:t')
    t.text = '目录将在打开文档后自动生成，如未显示请右键此处选择“更新域”。'
    r.append(t)
    fld.append(r)
    p._p.append(fld)


doc = Document()

# 全局样式
normal = doc.styles['Normal']
normal.font.name = 'Times New Roman'
normal.font.size = Pt(12)
normal.element.rPr.rFonts.set(qn('w:eastAsia'), '宋体')

# 页面设置
sec0 = doc.sections[0]
for s in [sec0]:
    s.page_height = Cm(29.7)
    s.page_width = Cm(21.0)
    s.top_margin = Cm(2.5)
    s.bottom_margin = Cm(2.5)
    s.left_margin = Cm(2.5)
    s.right_margin = Cm(2.5)

# ===== 封面 =====
for _ in range(4):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(0)

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_after = Pt(18)
set_run(p.add_run('校园活动报名系统'), '黑体', 'Times New Roman', 18, True)

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_after = Pt(36)
set_run(p.add_run('答辩汇报材料'), '黑体', 'Times New Roman', 18, True)

for line in ['Spring Boot 3 + Vue 3 + 微信原生小程序 三端协同实现',
             '',
             '汇报人：××',
             '指导教师：××',
             '专业班级：××',
             '',
             '2026 年 11 月']:
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(12)
    if line:
        set_run(p.add_run(line), '楷体', 'Times New Roman', 12)

# ===== 目录页 =====
sec1 = doc.add_section(WD_SECTION.NEW_PAGE)
sec1.page_height = Cm(29.7)
sec1.page_width = Cm(21.0)
sec1.top_margin = Cm(2.5)
sec1.bottom_margin = Cm(2.5)
sec1.left_margin = Cm(2.5)
sec1.right_margin = Cm(2.5)

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_after = Pt(18)
set_run(p.add_run('目　　录'), '黑体', 'Times New Roman', 16, True)
toc_block()

# ===== 正文 =====
sec2 = doc.add_section(WD_SECTION.NEW_PAGE)
sec2.page_height = Cm(29.7)
sec2.page_width = Cm(21.0)
sec2.top_margin = Cm(2.5)
sec2.bottom_margin = Cm(2.5)
sec2.left_margin = Cm(2.5)
sec2.right_margin = Cm(2.5)

# 页码从正文起算为 1
pgNum = OxmlElement('w:pgNumType')
pgNum.set(qn('w:start'), '1')
sec2._sectPr.append(pgNum)
page_number_footer(sec2)

# 一、项目概览
h1('一、项目概览')
h2('（一）项目基本信息')
body('校园活动报名系统面向校内活动从“发布—报名—名单统计”的完整流程，采用后端统一接口、PC 管理端与微信小程序双前端协同的方式实现。项目在原 PC 版基础上补齐了微信原生小程序，使学生在手机上即可完成查活动、报名和取消报名，组织者在电脑端完成活动维护与名单核对。')
caption('表 1　项目基本信息')
add_table(['项目', '内容'],
          [['系统名称', '校园活动报名系统（CampusActivity）'],
           ['系统形态', 'PC 管理端 + 微信原生小程序 + 统一后端接口'],
           ['核心用户', '学生（浏览、报名、取消、查看我的报名）；活动组织者（发布、编辑、删除活动，导出名单）'],
           ['技术栈', '后端 Spring Boot 3.5.7 + MyBatis + MySQL 8；PC 端 Vue 3 + Element Plus；移动端微信原生小程序（WXML / WXSS / JS，无 npm、无构建）'],
           ['数据规模', '3 张数据表（users、activities、registrations），5 条种子活动，3 个演示账号'],
           ['验证方式', 'Node 桩件业务自检 35 项 + 真实接口联调 + 局域网真机访问']],
          [Cm(3.2), Cm(12.8)], ['center', 'left'])

h2('（二）三端形态与职责')
body('三个部分不是简单重复实现三遍界面，而是各自承担不同角色：后端是唯一的规则执行者，两个前端只负责呈现与交互。这样做的直接好处是，同一套“名额是否已满”“是否重复报名”的判断不会因为换了一个端就出现两套逻辑。')
caption('表 2　三端构成与职责')
add_table(['构成', '技术实现', '主要职责', '页面或类数量'],
          [['PC 管理端', 'Vue 3 + Element Plus + axios', '活动发布、编辑、删除，报名名单与人数统计，活动检索与筛选', '7 个页面'],
           ['微信小程序', '原生 WXML / WXSS / JS', '活动浏览与筛选、详情报名与取消、我的报名、组织者移动端管理', '8 个页面、2 个自绘组件'],
           ['后端服务', 'Spring Boot + MyBatis', '提供 9 个 RESTful 接口，执行容量校验、重复报名拦截、状态流转', '14 个 Java 类'],
           ['数据库', 'MySQL 8（utf8mb4）', '三张表存储账号、活动、报名记录，唯一索引约束报名关系', '3 张表']],
          [Cm(2.6), Cm(4.4), Cm(6.6), Cm(2.4)], ['center', 'left', 'left', 'center'])

h2('（三）总体结论')
body('本项目把过去依赖“微信群接龙加在线表格”的报名流程，收敛为由活动、名额、报名三张表驱动的闭环流程：活动有明确的时间与容量，报名有唯一约束与状态标记，名额由后端实时计算，而不是由某一端的界面临时统计。答辩现场可以按“登录—检索—报名—查看—管理端核对名单”这条主线完整走一遍。')

# 二、背景与痛点
h1('二、背景与痛点')
h2('（一）现有做法的三个问题')
body('第一，报名信息分散。活动通知发在群里，报名靠接龙或者共享表格，谁报了、报了几次、还剩多少名额，需要人工反复核对。')
body('第二，名额缺少约束。接龙表本身不会拦截，活动容量写的是 100 人，实际收到 130 条报名时，只能事后人工删减，容易产生争议。')
body('第三，数据无法沉淀。活动结束后名单仍在聊天记录里，下一次活动要从头再来，人数统计、历史活动查询都没有稳定来源。')
h2('（二）需求实质')
body('这个项目的重点不是“把活动信息列出来”，而是让“报名”这件事具备状态约束和可追溯性。活动列表只是入口，真正需要设计的是：一个人对一场活动只能有一条有效报名记录、名额满时系统必须拒绝、取消后可以再次报名、组织者能按活动看到完整名单。')
h2('（三）目标与实现方式的对应关系')
caption('表 3　目标与实现方式对应关系')
add_table(['目标', '实现方式', '落点'],
          [['报名不重复', 'registrations 表对 (user_id, activity_id) 建唯一约束，业务层再给出友好提示', '数据库 + RegistrationService'],
           ['名额不超额', '报名前查询该活动 REGISTERED 数量，与 capacity 比较后决定是否写入', 'RegistrationService.register'],
           ['状态可追溯', '报名记录带 status 字段（REGISTERED / CANCELLED），取消不删数据而是改状态', 'registrations 表与取消接口'],
           ['两端一致', 'PC 端与小程序调用同一组接口，界面只做展示，不做规则判断', '/api/activities、/api/registrations'],
           ['现场不中断', '小程序内置演示数据，后端不可达时自动降级，页面不白屏', 'utils/mock.js、utils/api.js']],
          [Cm(3.0), Cm(9.4), Cm(3.6)], ['center', 'left', 'left'])

# 三、核心解决方案
h1('三、核心解决方案')
h2('（一）业务闭环')
body('系统围绕两条状态线运转：活动线决定“能不能报”，报名线决定“报没报成”。两条线的关系如下所示。')
code_block(['活动：  已发布（含起止时间、容量）',
            '          │  报名人数 < 容量',
            '          ├──► 可报名 ──► 名额已满（count >= capacity）──► 拒绝新报名',
            '          │',
            '          └──► 活动结束（当前时间晚于结束时间）──► 不再接受新报名',
            '',
            '报名：  未报名 ──► REGISTERED（报名成功）',
            '                    │  取消报名',
            '                    └──► CANCELLED ──► 可再次报名（重新置为 REGISTERED）'])
h2('（二）六条关键规则')
body('规则一：同一用户对同一活动只能存在一条报名记录，由数据库唯一约束 (user_id, activity_id) 兜底，应用层的重复判断只负责返回可读提示。')
body('规则二：报名前先查活动是否存在，不存在直接返回“活动不存在”，避免围绕空记录做后续判断。')
body('规则三：已存在且状态为 REGISTERED 的记录视为重复报名，返回“你已经报名该活动”，不再写入新记录。')
body('规则四：已报名人数达到容量即拒绝，判断放在服务层而不是前端，防止绕过界面直接调接口。')
body('规则五：取消报名不删除记录，而是按用户与活动定位后把状态改为 CANCELLED，保留操作痕迹。')
body('规则六：报名结果以字符串形式返回给前端（如“报名成功”“活动名额已满”），前端直接展示，不在客户端二次推断。')

# 四、功能全景
h1('四、功能全景')
h2('（一）PC 管理端')
caption('表 4　PC 端页面与功能')
add_table(['页面', '主要功能', '面向角色'],
          [['登录页', '账号密码登录，写入本地登录态，按角色进入不同导航', '全部'],
           ['活动列表', '卡片列表、关键词搜索、分类筛选、名额进度展示', '学生 / 管理员'],
           ['活动详情', '活动信息、剩余名额、报名与取消报名入口', '学生'],
           ['我的报名', '查看本人报名记录，支持取消', '学生'],
           ['活动管理', '活动列表维护，进入发布、编辑、名单、删除', '管理员'],
           ['发布 / 编辑', '标题、简介、分类、地点、起止时间、容量录入与校验', '管理员'],
           ['报名名单', '按活动查看报名者，统计已报名人数', '管理员']],
          [Cm(2.8), Cm(10.2), Cm(3.0)], ['center', 'left', 'center'])

h2('（二）微信小程序')
body('小程序共 8 个页面，功能与 PC 端一一对应，但按手机使用习惯重新组织：PC 端用表格承载的信息，小程序改成卡片；PC 端的下拉与日期选择，改成原生 picker；Element Plus 的弹窗提示，改成微信原生的 showToast 与 showModal。')
caption('表 5　小程序页面清单')
add_table(['页面', '路径', '主要功能'],
          [['活动列表', 'pages/list', '卡片列表、输入即搜、5 个分类标签筛选、下拉刷新'],
           ['活动详情', 'pages/detail', '活动信息、名额进度、底部固定报名 / 取消操作栏、名单入口'],
           ['登录', 'pages/login', '账号密码登录，写入 wx 本地存储'],
           ['我的报名', 'pages/mine', '本人报名记录，支持取消'],
           ['活动管理', 'pages/manage', '组织者维护活动，进入发布、名单、删除'],
           ['发布 / 编辑', 'pages/publish', '表单录入，日期与时间分两段选择，编辑时回填'],
           ['报名名单', 'pages/roster', '按活动查看报名者与人数'],
           ['个人中心', 'pages/me', '数据来源说明、重新连接后端、重置演示数据、退出登录']],
          [Cm(2.6), Cm(3.4), Cm(10.0)], ['center', 'left', 'left'])

h2('（三）页面规模与组件')
body('小程序整体 64 个文件、约 93 KB，不引入任何 npm 依赖。底部导航（components/tabbar）与顶部状态条（components/status-bar）为自绘组件：前者按登录角色动态渲染入口，学生只看到“活动 / 我的报名 / 我的”，管理员额外出现“活动管理”；后者在演示模式下显示橙色“演示数据”标记，使现场状态一眼可辨。')

# 五、技术架构
h1('五、技术架构')
h2('（一）分层结构')
code_block(['┌──────────────────────────────┐  ┌──────────────────────────────┐',
            '│  PC 管理端（Vue 3 + Element Plus）│  │ 微信小程序（原生 WXML/WXSS/JS） │',
            '└──────────────┬───────────────┘  └──────────────┬───────────────┘',
            '               │        HTTP / JSON（axios、wx.request）',
            '               ▼                                  ▼',
            '        ┌──────────────────────────────────────────────┐',
            '        │  Controller 层  活动 / 报名 / 用户 三个控制器     │',
            '        ├──────────────────────────────────────────────┤',
            '        │  Service 层   容量校验、重复报名拦截、状态流转    │',
            '        ├──────────────────────────────────────────────┤',
            '        │  Mapper 层（MyBatis）  三张表的增删改查           │',
            '        ├──────────────────────────────────────────────┤',
            '        │  MySQL 8    users / activities / registrations  │',
            '        └──────────────────────────────────────────────┘'])
h2('（二）分层职责')
caption('表 6　分层职责与关键类')
add_table(['层次', '职责', '关键实现'],
          [['Controller', '接收请求、参数绑定、返回 JSON；不做业务判断', 'ActivityController、RegistrationController、UserController'],
           ['Service', '执行报名规则、容量校验、状态改写的返回值组织', 'RegistrationService.register / cancel'],
           ['Mapper', '与数据库交互，SQL 与实体映射集中在此层', 'ActivityMapper、RegistrationMapper、UserMapper'],
           ['Config', '跨域配置，允许前端与小程序开发环境直接访问', 'CorsConfig'],
           ['数据层', '三表结构，唯一约束与外键保证数据一致性', 'campus_activity.sql']],
          [Cm(2.6), Cm(8.0), Cm(5.4)], ['center', 'left', 'left'])
h2('（三）接口清单')
body('三组控制器共 9 个接口，覆盖活动管理、报名与登录。前端与小程序使用完全相同的路径和返回结构。')
caption('表 7　接口清单')
add_table(['方法', '路径', '说明'],
          [['GET', '/api/activities', '活动列表（含简介、分类、地点、起止时间、容量）'],
           ['GET', '/api/activities/{id}', '活动详情'],
           ['POST', '/api/activities', '新增活动（管理员）'],
           ['PUT', '/api/activities/{id}', '修改活动'],
           ['DELETE', '/api/activities/{id}', '删除活动'],
           ['GET', '/api/registrations/count/{activityId}', '某活动已报名人数'],
           ['GET', '/api/registrations/activity/{activityId}', '某活动的报名名单'],
           ['GET', '/api/registrations/user/{userId}', '某用户的报名记录'],
           ['POST', '/api/registrations', '提交报名（含容量与重复校验）'],
           ['PUT', '/api/registrations/cancel/{userId}/{activityId}', '取消报名'],
           ['POST', '/api/users/login', '账号密码登录，返回角色信息']],
          [Cm(2.0), Cm(8.0), Cm(6.0)], ['center', 'left', 'left'])

# 六、关键实现
h1('六、关键实现与亮点')
h2('（一）用数据库唯一索引兜住重复报名')
body('应用层先查“是否已报名”再写入，两步之间存在时间窗口：同一个人连续点两次报名，两个请求可能同时通过查询。因此在 registrations 表上对 (user_id, activity_id) 建立唯一约束 uk_user_activity，作为最后一道防线；Service 里的重复判断则负责把错误翻译成人能看懂的一句话。这样即使前端被绕过，脏数据也写不进去。')
h2('（二）容量校验放在服务层')
body('报名时先按活动编号统计 status 为 REGISTERED 的记录数，再与活动的 capacity 比较，达到上限就返回“活动名额已满”。把这条判断放在后端的原因很直接：前端展示的进度条只是读数，不能作为准入依据；小程序端的学生也可能直接构造请求，只有后端判断才具备约束力。')
h2('（三）小程序的演示数据降级链路')
body('小程序不假设后端一定可达。utils/api.js 对 wx.request 做了统一封装，超时 6 秒；请求失败时切换到 utils/mock.js 的内置数据，语义与真实后端保持一致（同样的三个账号、同样的报名返回文案、同样的字段结构），数据落在 wx.setStorageSync 的本地缓存里。效果是：后端没起、IP 写错、防火墙拦截、跨网段访问，页面都不会白屏，顶栏会出现橙色“演示数据”标记。')
body('这条链路上还修正过一个隐患：早期实现中，只要有一次请求失败，“演示数据”标记就会被写进缓存，之后即使后端恢复也一直走本地数据。现在 app.js 的 onLaunch 会重置该标记，每次冷启动都重新尝试真实接口，个人中心也提供了“重新连接后端”和“重置演示数据”两个入口。')
h2('（四）原生小程序：零依赖、零构建')
body('移动端没有采用 uni-app 或 H5 套壳，而是直接写微信原生小程序。理由有三点：一是没有 npm 依赖和打包步骤，改完代码刷新即生效，答辩现场不会因为构建失败卡住；二是原生组件在真机上的滚动、下拉刷新、弹窗行为与微信一致，不会出现 H5 里常见的手势冲突；三是体积小，64 个文件约 93 KB，导入开发者工具即可运行。')
h2('（五）自绘底部导航与状态条')
body('微信原生 tabBar 的入口是静态配置的，无法按角色变化。项目改用自定义组件 tabbar，根据登录用户的 role 渲染菜单：学生看到“活动 / 我的报名 / 我的”，管理员在此基础上多出“活动管理”。status-bar 组件承担两件事——显示当前登录用户名，以及在后端不可达时提示当前处于演示数据模式。')
h2('（六）IP 自适应的一键启动')
body('局域网调试最常见的失败原因是电脑 IP 变化后小程序仍指向旧地址。项目用一组脚本把这件事自动化：start.ps1 依次执行“探测本机 IPv4 并写入 utils/config.js”“检查 MySQL80 服务”“新窗口启动后端”“轮询 8080 直到接口返回 200”“打开微信开发者工具”五步；外层的一键启动.bat 只做纯 ASCII 的胶水层，调用系统自带的 PowerShell，避免中文脚本在 cmd 下出现编码问题。停止、更新地址、开机自启也各有对应脚本。')
h2('（七）不装开发者工具也能验业务')
body('self-check.js 用 Node 桩件模拟 wx 的存储与请求接口，直接跑业务逻辑，覆盖登录、错误密码、活动列表、报名人数、报名、重复报名拦截、我的报名、取消、发布、详情、编辑、删除、名单，以及七个页面的数据处理，共 35 项。后端在跑时会额外验证真实接口链路，没跑则自动跳过。这份自检是答辩前回归的主要手段。')

# 七、演示数据
h1('七、演示数据设计')
body('演示数据的设计原则是“够用、可辨、能演完整流程”：账号覆盖学生与管理员两种角色，活动覆盖多个分类且容量不同，报名记录从零开始，便于现场完整走一遍报名与取消。')
caption('表 8　演示数据构成')
add_table(['数据对象', '数量', '展示点'],
          [['用户', '3 个（student01、student02、admin）', '两种角色切换，验证不同导航与权限入口'],
           ['活动', '5 条种子数据', '迎新活动、辩论赛、学术讲座、志愿服务、社会实践分享，分类与容量各异'],
           ['报名记录', '初始为空', '现场从零演示报名、重复报名拦截、取消后再次报名'],
           ['小程序演示数据', '6 条活动、3 个账号、2 条报名', '用于后端不可达时保持页面可操作']],
          [Cm(3.6), Cm(4.6), Cm(7.8)], ['center', 'left', 'left'])
body('各活动的容量刻意设置成 50 至 120 之间的不同数值，答辩时可以说明进度条与人数统计来自同一个接口，不存在两套口径。')

# 八、测试与验证
h1('八、测试与验证')
h2('（一）验证层次')
caption('表 9　验证层次与结果')
add_table(['验证层', '验证方式', '覆盖内容', '结果'],
          [['业务逻辑', 'node self-check.js', '登录、列表、报名、重复拦截、取消、发布、编辑、删除、名单等 35 项', '全部通过'],
           ['接口本地', '访问 http://localhost:8080/api/activities', '服务启动、路由映射、JSON 返回', 'HTTP 200'],
           ['接口局域网', '访问 http://本机IP:8080/api/activities', '跨设备可达性、防火墙放行', 'HTTP 200'],
           ['数据库', '执行 campus_activity.sql', '建库建表、种子数据导入、约束生效', '成功'],
           ['小程序端', '微信开发者工具模拟器 + 手机预览', '登录成功、列表渲染、报名写入数据库', '通过']],
          [Cm(2.4), Cm(6.2), Cm(5.6), Cm(1.8)], ['center', 'left', 'left', 'center'])
h2('（二）典型用例')
body('重复报名：同一账号对同一活动连续提交两次，第一次返回“报名成功”，第二次返回“你已经报名该活动”，数据库中仍只有一条记录。')
body('名额满额：把某活动容量临时改为 1，另一账号报名时返回“活动名额已满”，页面名额进度同步显示已满。')
body('取消后重报：取消报名后状态变为 CANCELLED，再次报名可重新置为 REGISTERED，记录数不变。')
body('后端不可达：停止后端后重新进入小程序，页面自动切换演示数据，顶栏出现橙色标记，操作仍可完成。')

# 九、演示建议
h1('九、现场演示建议')
body('建议总时长控制在 5 至 6 分钟，按“手机报名 + 电脑核名单”的双端对照来讲，比单纯翻页面更能说明三端协同的价值。')
caption('表 10　演示步骤与时间分配')
add_table(['步骤', '操作', '讲解要点', '用时'],
          [['1', '小程序登录 student01', '登录态、角色决定底部导航', '30 秒'],
           ['2', '列表搜索“讲座”、点分类标签', '输入即筛、5 个分类、卡片展示', '40 秒'],
           ['3', '进入详情，查看名额进度并报名', '名额来自接口计数，报名由后端校验', '40 秒'],
           ['4', '我的报名查看记录，再取消', '状态改写而非删除，取消后可重报', '40 秒'],
           ['5', '切换 admin，进入活动管理与报名名单', '按活动查名单、人数统计、删除确认', '60 秒'],
           ['6', '发布一条新活动（可选）', '表单校验、日期时间两段选择、编辑回填', '50 秒'],
           ['7', '停止后端，演示降级提示', '演示数据链路与恢复入口', '30 秒']],
          [Cm(1.4), Cm(5.4), Cm(7.4), Cm(1.8)], ['center', 'left', 'left', 'center'])

# 十、答辩问题
h1('十、常见答辩问题')
qa = [
    ('为什么移动端用原生小程序，而不是 uni-app 或 H5 套壳？',
     '原生小程序不需要 npm 依赖和构建，改完刷新即生效，答辩现场风险最低；同时原生组件的手势、弹窗、下拉刷新行为与微信一致，体积也更小。代价是不能一套代码同时产出 App 和 H5，本项目也不需要在微信之外分发。'),
    ('两端怎么共用一套接口？跨域怎么解决？',
     'PC 端用 axios、小程序用 wx.request，路径与返回结构完全一致，都是 /api/activities、/api/registrations 这一组。PC 端存在端口与域名差异，通过后端 CorsConfig 统一放行；小程序开发阶段在开发者工具中勾选“不校验合法域名”，真机预览继承该设置。'),
    ('重复报名怎么防？并发下会不会写出两条记录？',
     '两层：Service 先查状态并返回友好提示，数据库再用 (user_id, activity_id) 唯一约束兜底。即使两个请求同时通过查询，第二条写入会被唯一索引拒绝，因此不会产生重复记录。'),
    ('名额满了的判断在哪一层？前端能不能绕过？',
     '在 Service 层的报名方法里，统计 REGISTERED 数量与容量比较后决定是否写入。前端只展示进度，不做准入判断，直接调接口也会被同一段逻辑拦住。'),
    ('密码为什么是明文？',
     '这是沿用课程项目的既有设计，方便演示与调试。生产环境应改为 BCrypt 存储，并配合服务端会话或 JWT 做身份校验，这一点已写入后续规划。'),
    ('小程序连不上后端怎么办？',
     'api.js 统一封装请求，超时 6 秒后切换到内置演示数据，页面不会白屏，顶栏显示橙色“演示数据”。个人中心提供“重新连接后端”和“重置演示数据”，冷启动也会自动重试真实接口。'),
    ('换网络后 IP 变了怎么办？',
     '双击“更新后端地址.bat”即可把当前电脑 IPv4 写回 utils/config.js；一键启动脚本在启动时也会先做这一步，所以正常流程不需要手动改文件。'),
    ('人数统计在哪里做？会不会两端不一致？',
     '在 registrations 表上按活动统计 status 为 REGISTERED 的记录数，通过 /api/registrations/count/{activityId} 返回。两端都读这个接口，因此不会出现两套口径。'),
    ('为什么没有做分页？',
     '当前是课程实训规模，活动数量在个位数，一次性返回便于前端筛选与演示。数据量上来后应在 Mapper 层加 limit 与 offset，并让列表改为上拉加载，这一点已列入后续规划。'),
    ('这个系统能直接上线吗？还差什么？',
     '业务闭环是完整的，但上线还差三件事：后端部署到有 HTTPS 的服务器并完成域名备案、在小程序后台配置 request 合法域名、把明文密码与前端角色判断改成后端鉴权。'),
]
for i, (q, a) in enumerate(qa, 1):
    h3('Q%d　%s' % (i, q))
    body(a)

# 十一、不足与规划
h1('十一、不足与后续规划')
body('下面按“当前限制—后续方案”逐条对应，避免泛泛而谈的改进方向。')
caption('表 11　当前限制与后续方案')
add_table(['当前限制', '后续方案'],
          [['密码明文存储', '改为 BCrypt 加密，登录成功后签发 JWT，接口统一校验'],
           ['角色判断仅用于界面展示', '在后端增加拦截器，按 role 校验活动增删改与名单接口的调用权限'],
           ['活动没有独立状态字段，是否结束靠时间推断', '增加 status 字段（草稿 / 报名中 / 已结束），由组织者显式关闭报名'],
           ['列表一次性返回，无分页', 'Mapper 增加分页参数，小程序改为上拉加载'],
           ['仅 http + 局域网地址，不能对外发布', '后端部署至 HTTPS 服务器、域名备案、配置 request 合法域名'],
           ['缺少自动化单元测试', '补充 JUnit 与 MockMvc 接口测试，覆盖报名与取消的边界条件'],
           ['运行库中存在 1 条测试遗留数据（标题为单个字符的活动）', '答辩前清理，或在初始化脚本中重置为种子数据']],
          [Cm(7.4), Cm(8.6)], ['left', 'left'])

# 十二、账号与命令
h1('十二、演示账号与运行命令')
h2('（一）演示账号')
caption('表 12　演示账号')
add_table(['账号', '密码', '角色', '可用功能'],
          [['student01', '123456', '学生', '浏览、报名、取消、我的报名'],
           ['student02', '123456', '学生', '用于演示名额与重复报名场景'],
           ['admin', '123456', '管理员', '发布、编辑、删除活动，查看报名名单']],
          [Cm(3.2), Cm(3.2), Cm(3.2), Cm(6.4)], ['center', 'center', 'center', 'left'])
h2('（二）运行命令')
body('后端依赖 JDK 21 与 Maven 3.9，数据库为 MySQL 8，库名 campus_activity。以下三条命令分别用于启动服务、运行业务自检和确认接口可用。')
code_block(['# 1. 启动后端（项目根目录）',
            'mvn -f backend\\pom.xml spring-boot:run',
            '',
            '# 2. 业务逻辑自检（不装开发者工具也可运行）',
            'cd weapp && node self-check.js',
            '',
            '# 3. 确认接口可用',
            'curl http://localhost:8080/api/activities'])
body('日常使用可直接双击 weapp 目录下的一键启动.bat：脚本会自动探测本机 IP、确认 MySQL 服务、启动后端、等待接口就绪并打开微信开发者工具；一键停止.bat 用于关闭后端。需要开机即用时，运行一次开机自动启动.bat，取消则运行取消开机自动启动.bat。')

doc.save(OUT)
print('OK', OUT, os.path.getsize(OUT))
