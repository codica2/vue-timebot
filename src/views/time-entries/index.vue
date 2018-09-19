<template lang="pug">
  div
    filters
    el-table(
        v-loading="listLoading"
        :key="tableKey"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;")
      el-table-column(type="selection", width="55")
      el-table-column(:label="$t('table.id')" align="center" width="65")
        template(slot-scope="scope")
          span {{ scope.row.id }}
      el-table-column(label="User")
        template(slot-scope="scope")
          span {{ scope.row.user_id }}
      el-table-column(label="Project")
        template(slot-scope="scope")
          span {{ scope.row.project_id }}
      el-table-column(label="Date")
        template(slot-scope="scope")
          span {{ scope.row.updated_at }}
      el-table-column(label="Time")
        template(slot-scope="scope")
          span {{ scope.row.time }}
      el-table-column(label="Details")
        template(slot-scope="scope")
          span {{ scope.row.details }}
      el-table-column(:label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width")
        template(slot-scope="scope")
          el-button(type="primary" size="mini" @click="handleView(scope.row)") View
          el-button(type="primary" size="mini" @click="handleUpdate(scope.row)") {{ $t('table.edit') }}
          el-button(v-if="scope.row.status!='deleted'" size="mini" type="danger" @click="handleModifyStatus(scope.row,'deleted')") {{ $t('table.delete') }}
    div.pagination-container
      el-pagination(v-show="total>0"
      :current-page="listQuery.page"
      :page-sizes="[10,20,30, 50]"
      :page-size="listQuery.limit"
      :total="total"
      background layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange" @current-change="handleCurrentChange")
    el-dialog(:title="textMap[dialogStatus]" :visible.sync="dialogFormVisible")
      el-form(ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;")
        el-form-item(label="User" prop="user_id")
          el-select(v-model="temp.user_id" class="filter-item" placeholder="Please select")
            el-option(v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key")
        el-form-item(label="Project" prop="project_id")
          el-select(v-model="temp.project_id" class="filter-item" placeholder="Please select")
            el-option(v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key")
        el-form-item(:label="$t('table.date')" prop="timestamp")
          el-date-picker(v-model="temp.date" type="datetime" placeholder="Please pick a date")
        el-form-item(label="Time" prop="timestamp")
          el-time-picker(v-model="temp.time" type="datetime" placeholder="Please pick a time")
        el-form-item(label="Details" prop="timestamp")
          el-input(v-model="temp.details" type="details" placeholder="Write smth")
      div(slot="footer" class="dialog-footer")
        el-button(@click="dialogFormVisible = false") {{ $t('table.cancel') }}
        el-button(v-if="dialogStatus=='create'" type="primary" @click="createData") {{ $t('table.confirm') }}
        el-button(v-else type="primary" @click="updateData") {{ $t('table.confirm') }}
    el-dialog(:title="textMap[dialogStatus]" :visible.sync="dialogViewVisible")
      div {{temp.user_id}} User
      div {{temp.created_at}} Created at
      div {{temp.date}} Date
      div {{temp.details}} Details
      div {{temp.id}} Id
      div {{temp.minutes}} Minutes
      div {{temp.project_id}} Project
      div {{temp.ticket}} Ticket
      div {{temp.time}} Time
      div {{temp.trello_labels}} Trello labels
      div {{temp.updated_at}} Updated at
      div {{temp.ticket}} Ticket

</template>

<script>
  import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
  import waves from '@/directive/waves' // 水波纹指令
  import { parseTime } from '@/utils'
  import filters from './filters'
  const calendarTypeOptions = [
    { key: 'CN', display_name: 'China' },
    { key: 'US', display_name: 'USA' },
    { key: 'JP', display_name: 'Japan' },
    { key: 'EU', display_name: 'Eurozone' }
  ]
  const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  }, {})

  export default {
    name: 'TimeEntries',
    data: () => ({
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{label: 'ID Ascending', key: '+id'}, {label: 'ID Descending', key: '-id'}],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogViewVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create',
        view: 'View'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{required: true, message: 'type is required', trigger: 'change'}],
        timestamp: [{type: 'date', required: true, message: 'timestamp is required', trigger: 'change'}],
        title: [{required: true, message: 'title is required', trigger: 'blur'}]
      },
      downloadLoading: false,
      data: [{"id":24509,"user_id":46,"date":"2018-09-18","time":" 4:00","minutes":240,"details":"\u003chttps://trello.com/c/s5in9ShD/1183-refactor-models\u003e refactored viewer logic, fixed scopes, installed overcommit to all machines, checked rubocop","created_at":"2018-09-19T06:57:19.090Z","updated_at":"2018-09-19T06:57:19.090Z","project_id":10,"trello_labels":["Normal  Priority","Improvement","8"],"ticket":"https://trello.com/c/s5in9ShD/1183-refactor-models"},{"id":24508,"user_id":46,"date":"2018-09-18","time":" 0:20","minutes":20,"details":"daily meeting","created_at":"2018-09-19T06:55:43.783Z","updated_at":"2018-09-19T06:55:43.783Z","project_id":19,"trello_labels":null,"ticket":null},{"id":24507,"user_id":46,"date":"2018-09-18","time":" 2:40","minutes":160,"details":"\u003chttps://trello.com/c/fKmEpGpF/1176-tests-for-models\u003e checked PR. prepared branches for redesign, fixed conflicts","created_at":"2018-09-19T06:55:30.031Z","updated_at":"2018-09-19T06:55:30.031Z","project_id":10,"trello_labels":["13"],"ticket":"https://trello.com/c/fKmEpGpF/1176-tests-for-models"},{"id":24506,"user_id":71,"date":"2018-09-18","time":" 1:00","minutes":60,"details":"\u003chttps://trello.com/c/VJ06iVLX/90-article-5-pwa\u003e","created_at":"2018-09-19T05:51:17.312Z","updated_at":"2018-09-19T05:51:17.312Z","project_id":68,"trello_labels":[],"ticket":"https://trello.com/c/VJ06iVLX/90-article-5-pwa"},{"id":24505,"user_id":71,"date":"2018-09-18","time":" 7:05","minutes":425,"details":"\u003chttps://trello.com/c/UB07HsVL/97-article-6-ingredients-of-distant-cooperation\u003e","created_at":"2018-09-19T05:50:31.321Z","updated_at":"2018-09-19T05:50:31.321Z","project_id":68,"trello_labels":[],"ticket":"https://trello.com/c/UB07HsVL/97-article-6-ingredients-of-distant-cooperation"},{"id":24504,"user_id":80,"date":"2018-09-18","time":"2:45","minutes":165,"details":"meetings, setting up Jira board, planning projects, checking timebot, emails composing, discussing issues","created_at":"2018-09-18T16:39:16.526Z","updated_at":"2018-09-18T16:40:13.462Z","project_id":53,"trello_labels":null,"ticket":null},{"id":24503,"user_id":80,"date":"2018-09-18","time":" 1:00","minutes":60,"details":"time reports","created_at":"2018-09-18T16:38:03.453Z","updated_at":"2018-09-18T16:38:03.453Z","project_id":54,"trello_labels":null,"ticket":null},{"id":24502,"user_id":80,"date":"2018-09-18","time":" 0:45","minutes":45,"details":"QA+PM","created_at":"2018-09-18T16:37:27.021Z","updated_at":"2018-09-18T16:37:27.021Z","project_id":72,"trello_labels":null,"ticket":null},{"id":24501,"user_id":80,"date":"2018-09-18","time":" 1:00","minutes":60,"details":"designing","created_at":"2018-09-18T16:36:57.106Z","updated_at":"2018-09-18T16:36:57.106Z","project_id":74,"trello_labels":null,"ticket":null},{"id":24500,"user_id":80,"date":"2018-09-18","time":" 1:20","minutes":80,"details":"PM","created_at":"2018-09-18T16:36:27.804Z","updated_at":"2018-09-18T16:36:27.804Z","project_id":10,"trello_labels":null,"ticket":null},{"id":24499,"user_id":94,"date":"2018-09-18","time":" 0:30","minutes":30,"details":"discussing tasks","created_at":"2018-09-18T16:33:00.980Z","updated_at":"2018-09-18T16:33:00.980Z","project_id":68,"trello_labels":null,"ticket":null},{"id":24498,"user_id":94,"date":"2018-09-18","time":" 0:15","minutes":15,"details":"sorting documents","created_at":"2018-09-18T16:32:52.903Z","updated_at":"2018-09-18T16:32:52.903Z","project_id":68,"trello_labels":null,"ticket":null},{"id":24497,"user_id":94,"date":"2018-09-18","time":" 0:30","minutes":30,"details":"\u003chttps://trello.com/c/RE3Vx1ge/263-website-updates-1809\u003e","created_at":"2018-09-18T16:32:37.935Z","updated_at":"2018-09-18T16:32:37.935Z","project_id":68,"trello_labels":[],"ticket":"https://trello.com/c/RE3Vx1ge/263-website-updates-1809"},{"id":24496,"user_id":94,"date":"2018-09-18","time":" 4:30","minutes":270,"details":"\u003chttps://trello.com/c/VJ06iVLX/90-article-5-pwa\u003e","created_at":"2018-09-18T16:31:53.383Z","updated_at":"2018-09-18T16:31:53.383Z","project_id":68,"trello_labels":[],"ticket":"https://trello.com/c/VJ06iVLX/90-article-5-pwa"},{"id":24495,"user_id":94,"date":"2018-09-18","time":" 1:30","minutes":90,"details":"\u003chttps://trello.com/c/UB07HsVL/97-article-6-ingredients-of-distant-cooperation\u003e","created_at":"2018-09-18T16:31:27.197Z","updated_at":"2018-09-18T16:31:27.197Z","project_id":68,"trello_labels":[],"ticket":"https://trello.com/c/UB07HsVL/97-article-6-ingredients-of-distant-cooperation"},{"id":24494,"user_id":94,"date":"2018-09-18","time":" 0:15","minutes":15,"details":"analytics","created_at":"2018-09-18T16:31:15.949Z","updated_at":"2018-09-18T16:31:15.949Z","project_id":68,"trello_labels":null,"ticket":null},{"id":24493,"user_id":94,"date":"2018-09-18","time":" 0:30","minutes":30,"details":"\u003chttps://trello.com/c/46ig8kzO/94-posts-for-socials\u003e","created_at":"2018-09-18T16:31:05.010Z","updated_at":"2018-09-18T16:31:05.010Z","project_id":68,"trello_labels":[],"ticket":"https://trello.com/c/46ig8kzO/94-posts-for-socials"},{"id":24492,"user_id":8,"date":"2018-09-18","time":" 8:15","minutes":495,"details":"\u003chttps://trello.com/c/NfkZlXlW/1580-create-a-tool-to-manage-the-different-banner-spaces-on-the-websites\u003e","created_at":"2018-09-18T16:29:24.716Z","updated_at":"2018-09-18T16:29:24.716Z","project_id":35,"trello_labels":["Feature","High Priority","13","General"],"ticket":"https://trello.com/c/NfkZlXlW/1580-create-a-tool-to-manage-the-different-banner-spaces-on-the-websites"},{"id":24491,"user_id":8,"date":"2018-09-18","time":" 0:15","minutes":15,"details":"daily meeting","created_at":"2018-09-18T16:29:03.358Z","updated_at":"2018-09-18T16:29:03.358Z","project_id":19,"trello_labels":null,"ticket":null},{"id":24490,"user_id":77,"date":"2018-09-18","time":" 8:00","minutes":480,"details":"design","created_at":"2018-09-18T16:21:40.575Z","updated_at":"2018-09-18T16:21:40.575Z","project_id":74,"trello_labels":null,"ticket":null},{"id":24489,"user_id":77,"date":"2018-09-17","time":" 6:00","minutes":360,"details":"design","created_at":"2018-09-18T16:21:21.944Z","updated_at":"2018-09-18T16:21:21.944Z","project_id":74,"trello_labels":null,"ticket":null},{"id":24488,"user_id":95,"date":"2018-09-18","time":" 8:00","minutes":480,"details":"make lamda function, coding views, integrate API","created_at":"2018-09-18T15:53:57.770Z","updated_at":"2018-09-18T15:53:57.770Z","project_id":72,"trello_labels":null,"ticket":null},{"id":24487,"user_id":95,"date":"2018-09-18","time":" 0:20","minutes":20,"details":"daily meeting","created_at":"2018-09-18T15:53:12.810Z","updated_at":"2018-09-18T15:53:12.810Z","project_id":19,"trello_labels":null,"ticket":null},{"id":24486,"user_id":96,"date":"2018-09-18","time":" 3:00","minutes":180,"details":"\u003chttps://trello.com/c/LqIBvmHI/69-create-project-page\u003e","created_at":"2018-09-18T15:31:32.712Z","updated_at":"2018-09-18T15:31:32.712Z","project_id":13,"trello_labels":["5"],"ticket":"https://trello.com/c/LqIBvmHI/69-create-project-page"},{"id":24485,"user_id":96,"date":"2018-09-18","time":" 5:00","minutes":300,"details":"\u003chttps://trello.com/c/s08SsWVt/68-create-a-dashboard\u003e","created_at":"2018-09-18T15:31:03.165Z","updated_at":"2018-09-18T15:31:03.165Z","project_id":13,"trello_labels":["5"],"ticket":"https://trello.com/c/s08SsWVt/68-create-a-dashboard"},{"id":24484,"user_id":93,"date":"2018-09-18","time":" 5:30","minutes":330,"details":"\u003chttps://trello.com/c/EwpZ3nfg/1180-redesign-admin-navigation\u003e","created_at":"2018-09-18T15:30:28.575Z","updated_at":"2018-09-18T15:30:28.575Z","project_id":10,"trello_labels":["13"],"ticket":"https://trello.com/c/EwpZ3nfg/1180-redesign-admin-navigation"},{"id":24483,"user_id":93,"date":"2018-09-18","time":" 0:30","minutes":30,"details":"fix conflict after rebase","created_at":"2018-09-18T15:30:18.812Z","updated_at":"2018-09-18T15:30:18.812Z","project_id":10,"trello_labels":null,"ticket":null},{"id":24482,"user_id":93,"date":"2018-09-18","time":" 0:15","minutes":15,"details":"daily standup","created_at":"2018-09-18T15:30:02.958Z","updated_at":"2018-09-18T15:30:02.958Z","project_id":19,"trello_labels":null,"ticket":null},{"id":24481,"user_id":93,"date":"2018-09-18","time":" 1:45","minutes":105,"details":"\u003chttps://trello.com/c/FnYOctuo/1182-fix-viewers-investors-popover\u003e Fix viewers/investors popover","created_at":"2018-09-18T15:29:49.320Z","updated_at":"2018-09-18T15:29:49.320Z","project_id":10,"trello_labels":["High Priority","Bug","2","Hotfix 2.0.1.3"],"ticket":"https://trello.com/c/FnYOctuo/1182-fix-viewers-investors-popover"},{"id":24480,"user_id":81,"date":"2018-09-18","time":" 0:50","minutes":50,"details":"redux form wizard (multistep form), discussions","created_at":"2018-09-18T15:19:34.921Z","updated_at":"2018-09-18T15:19:34.921Z","project_id":74,"trello_labels":null,"ticket":null}]
    }),
    directives: {
      waves
    },
    components: {
      filters
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'info',
          deleted: 'danger'
        }
        return statusMap[status]
      },
      typeFilter(type) {
        return calendarTypeKeyValue[type]
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        this.list = [{"id":24509,"user_id":46,"date":"2018-09-18","time":" 4:00","minutes":240,"details":"\u003chttps://trello.com/c/s5in9ShD/1183-refactor-models\u003e refactored viewer logic, fixed scopes, installed overcommit to all machines, checked rubocop","created_at":"2018-09-19T06:57:19.090Z","updated_at":"2018-09-19T06:57:19.090Z","project_id":10,"trello_labels":["Normal  Priority","Improvement","8"],"ticket":"https://trello.com/c/s5in9ShD/1183-refactor-models"},{"id":24508,"user_id":46,"date":"2018-09-18","time":" 0:20","minutes":20,"details":"daily meeting","created_at":"2018-09-19T06:55:43.783Z","updated_at":"2018-09-19T06:55:43.783Z","project_id":19,"trello_labels":null,"ticket":null},{"id":24507,"user_id":46,"date":"2018-09-18","time":" 2:40","minutes":160,"details":"\u003chttps://trello.com/c/fKmEpGpF/1176-tests-for-models\u003e checked PR. prepared branches for redesign, fixed conflicts","created_at":"2018-09-19T06:55:30.031Z","updated_at":"2018-09-19T06:55:30.031Z","project_id":10,"trello_labels":["13"],"ticket":"https://trello.com/c/fKmEpGpF/1176-tests-for-models"},{"id":24506,"user_id":71,"date":"2018-09-18","time":" 1:00","minutes":60,"details":"\u003chttps://trello.com/c/VJ06iVLX/90-article-5-pwa\u003e","created_at":"2018-09-19T05:51:17.312Z","updated_at":"2018-09-19T05:51:17.312Z","project_id":68,"trello_labels":[],"ticket":"https://trello.com/c/VJ06iVLX/90-article-5-pwa"},{"id":24505,"user_id":71,"date":"2018-09-18","time":" 7:05","minutes":425,"details":"\u003chttps://trello.com/c/UB07HsVL/97-article-6-ingredients-of-distant-cooperation\u003e","created_at":"2018-09-19T05:50:31.321Z","updated_at":"2018-09-19T05:50:31.321Z","project_id":68,"trello_labels":[],"ticket":"https://trello.com/c/UB07HsVL/97-article-6-ingredients-of-distant-cooperation"},{"id":24504,"user_id":80,"date":"2018-09-18","time":"2:45","minutes":165,"details":"meetings, setting up Jira board, planning projects, checking timebot, emails composing, discussing issues","created_at":"2018-09-18T16:39:16.526Z","updated_at":"2018-09-18T16:40:13.462Z","project_id":53,"trello_labels":null,"ticket":null},{"id":24503,"user_id":80,"date":"2018-09-18","time":" 1:00","minutes":60,"details":"time reports","created_at":"2018-09-18T16:38:03.453Z","updated_at":"2018-09-18T16:38:03.453Z","project_id":54,"trello_labels":null,"ticket":null},{"id":24502,"user_id":80,"date":"2018-09-18","time":" 0:45","minutes":45,"details":"QA+PM","created_at":"2018-09-18T16:37:27.021Z","updated_at":"2018-09-18T16:37:27.021Z","project_id":72,"trello_labels":null,"ticket":null},{"id":24501,"user_id":80,"date":"2018-09-18","time":" 1:00","minutes":60,"details":"designing","created_at":"2018-09-18T16:36:57.106Z","updated_at":"2018-09-18T16:36:57.106Z","project_id":74,"trello_labels":null,"ticket":null},{"id":24500,"user_id":80,"date":"2018-09-18","time":" 1:20","minutes":80,"details":"PM","created_at":"2018-09-18T16:36:27.804Z","updated_at":"2018-09-18T16:36:27.804Z","project_id":10,"trello_labels":null,"ticket":null},{"id":24499,"user_id":94,"date":"2018-09-18","time":" 0:30","minutes":30,"details":"discussing tasks","created_at":"2018-09-18T16:33:00.980Z","updated_at":"2018-09-18T16:33:00.980Z","project_id":68,"trello_labels":null,"ticket":null},{"id":24498,"user_id":94,"date":"2018-09-18","time":" 0:15","minutes":15,"details":"sorting documents","created_at":"2018-09-18T16:32:52.903Z","updated_at":"2018-09-18T16:32:52.903Z","project_id":68,"trello_labels":null,"ticket":null},{"id":24497,"user_id":94,"date":"2018-09-18","time":" 0:30","minutes":30,"details":"\u003chttps://trello.com/c/RE3Vx1ge/263-website-updates-1809\u003e","created_at":"2018-09-18T16:32:37.935Z","updated_at":"2018-09-18T16:32:37.935Z","project_id":68,"trello_labels":[],"ticket":"https://trello.com/c/RE3Vx1ge/263-website-updates-1809"},{"id":24496,"user_id":94,"date":"2018-09-18","time":" 4:30","minutes":270,"details":"\u003chttps://trello.com/c/VJ06iVLX/90-article-5-pwa\u003e","created_at":"2018-09-18T16:31:53.383Z","updated_at":"2018-09-18T16:31:53.383Z","project_id":68,"trello_labels":[],"ticket":"https://trello.com/c/VJ06iVLX/90-article-5-pwa"},{"id":24495,"user_id":94,"date":"2018-09-18","time":" 1:30","minutes":90,"details":"\u003chttps://trello.com/c/UB07HsVL/97-article-6-ingredients-of-distant-cooperation\u003e","created_at":"2018-09-18T16:31:27.197Z","updated_at":"2018-09-18T16:31:27.197Z","project_id":68,"trello_labels":[],"ticket":"https://trello.com/c/UB07HsVL/97-article-6-ingredients-of-distant-cooperation"},{"id":24494,"user_id":94,"date":"2018-09-18","time":" 0:15","minutes":15,"details":"analytics","created_at":"2018-09-18T16:31:15.949Z","updated_at":"2018-09-18T16:31:15.949Z","project_id":68,"trello_labels":null,"ticket":null},{"id":24493,"user_id":94,"date":"2018-09-18","time":" 0:30","minutes":30,"details":"\u003chttps://trello.com/c/46ig8kzO/94-posts-for-socials\u003e","created_at":"2018-09-18T16:31:05.010Z","updated_at":"2018-09-18T16:31:05.010Z","project_id":68,"trello_labels":[],"ticket":"https://trello.com/c/46ig8kzO/94-posts-for-socials"},{"id":24492,"user_id":8,"date":"2018-09-18","time":" 8:15","minutes":495,"details":"\u003chttps://trello.com/c/NfkZlXlW/1580-create-a-tool-to-manage-the-different-banner-spaces-on-the-websites\u003e","created_at":"2018-09-18T16:29:24.716Z","updated_at":"2018-09-18T16:29:24.716Z","project_id":35,"trello_labels":["Feature","High Priority","13","General"],"ticket":"https://trello.com/c/NfkZlXlW/1580-create-a-tool-to-manage-the-different-banner-spaces-on-the-websites"},{"id":24491,"user_id":8,"date":"2018-09-18","time":" 0:15","minutes":15,"details":"daily meeting","created_at":"2018-09-18T16:29:03.358Z","updated_at":"2018-09-18T16:29:03.358Z","project_id":19,"trello_labels":null,"ticket":null},{"id":24490,"user_id":77,"date":"2018-09-18","time":" 8:00","minutes":480,"details":"design","created_at":"2018-09-18T16:21:40.575Z","updated_at":"2018-09-18T16:21:40.575Z","project_id":74,"trello_labels":null,"ticket":null},{"id":24489,"user_id":77,"date":"2018-09-17","time":" 6:00","minutes":360,"details":"design","created_at":"2018-09-18T16:21:21.944Z","updated_at":"2018-09-18T16:21:21.944Z","project_id":74,"trello_labels":null,"ticket":null},{"id":24488,"user_id":95,"date":"2018-09-18","time":" 8:00","minutes":480,"details":"make lamda function, coding views, integrate API","created_at":"2018-09-18T15:53:57.770Z","updated_at":"2018-09-18T15:53:57.770Z","project_id":72,"trello_labels":null,"ticket":null},{"id":24487,"user_id":95,"date":"2018-09-18","time":" 0:20","minutes":20,"details":"daily meeting","created_at":"2018-09-18T15:53:12.810Z","updated_at":"2018-09-18T15:53:12.810Z","project_id":19,"trello_labels":null,"ticket":null},{"id":24486,"user_id":96,"date":"2018-09-18","time":" 3:00","minutes":180,"details":"\u003chttps://trello.com/c/LqIBvmHI/69-create-project-page\u003e","created_at":"2018-09-18T15:31:32.712Z","updated_at":"2018-09-18T15:31:32.712Z","project_id":13,"trello_labels":["5"],"ticket":"https://trello.com/c/LqIBvmHI/69-create-project-page"},{"id":24485,"user_id":96,"date":"2018-09-18","time":" 5:00","minutes":300,"details":"\u003chttps://trello.com/c/s08SsWVt/68-create-a-dashboard\u003e","created_at":"2018-09-18T15:31:03.165Z","updated_at":"2018-09-18T15:31:03.165Z","project_id":13,"trello_labels":["5"],"ticket":"https://trello.com/c/s08SsWVt/68-create-a-dashboard"},{"id":24484,"user_id":93,"date":"2018-09-18","time":" 5:30","minutes":330,"details":"\u003chttps://trello.com/c/EwpZ3nfg/1180-redesign-admin-navigation\u003e","created_at":"2018-09-18T15:30:28.575Z","updated_at":"2018-09-18T15:30:28.575Z","project_id":10,"trello_labels":["13"],"ticket":"https://trello.com/c/EwpZ3nfg/1180-redesign-admin-navigation"},{"id":24483,"user_id":93,"date":"2018-09-18","time":" 0:30","minutes":30,"details":"fix conflict after rebase","created_at":"2018-09-18T15:30:18.812Z","updated_at":"2018-09-18T15:30:18.812Z","project_id":10,"trello_labels":null,"ticket":null},{"id":24482,"user_id":93,"date":"2018-09-18","time":" 0:15","minutes":15,"details":"daily standup","created_at":"2018-09-18T15:30:02.958Z","updated_at":"2018-09-18T15:30:02.958Z","project_id":19,"trello_labels":null,"ticket":null},{"id":24481,"user_id":93,"date":"2018-09-18","time":" 1:45","minutes":105,"details":"\u003chttps://trello.com/c/FnYOctuo/1182-fix-viewers-investors-popover\u003e Fix viewers/investors popover","created_at":"2018-09-18T15:29:49.320Z","updated_at":"2018-09-18T15:29:49.320Z","project_id":10,"trello_labels":["High Priority","Bug","2","Hotfix 2.0.1.3"],"ticket":"https://trello.com/c/FnYOctuo/1182-fix-viewers-investors-popover"},{"id":24480,"user_id":81,"date":"2018-09-18","time":" 0:50","minutes":50,"details":"redux form wizard (multistep form), discussions","created_at":"2018-09-18T15:19:34.921Z","updated_at":"2018-09-18T15:19:34.921Z","project_id":74,"trello_labels":null,"ticket":null}]
        this.total = 30
        this.listLoading = false
      },
      handleModifyStatus(row, status) {
        this.$message({
          message: 'Delete',
          type: 'success'
        })
        row.status = status
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
            this.temp.author = 'vue-element-admin'
            createArticle(this.temp).then(() => {
              this.list.unshift(this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      handleView(row) {
        this.temp = Object.assign({}, row)
        this.dialogStatus = 'view'
        this.dialogViewVisible = true
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.temp.timestamp = new Date(this.temp.timestamp)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
            updateArticle(tempData).then(() => {
              for (const v of this.list) {
                if (v.id === this.temp.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.temp)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      }
    }
}
</script>

<style lang="scss">
</style>
