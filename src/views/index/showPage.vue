<template>
  <div>
    <el-drawer v-bind="$attrs" v-on="$listeners" @opened="onOpen" @close="onClose">
      <div style="height:100%">
        <el-row style="height:100%;overflow:auto">
          <el-col :md="24" :lg="12" class="left-editor" v-show="false" >
            <div class="setting" title="资源引用" @click="showResource">
              <el-badge :is-dot="!!resources.length" class="item">
                <i class="el-icon-setting" />
              </el-badge>
            </div>

            <div v-show="activeTab==='html'" id="editorHtml" class="tab-editor" />
            <div v-show="activeTab==='js'" id="editorJs" class="tab-editor" />
            <div v-show="activeTab==='css'" id="editorCss" class="tab-editor" />
          </el-col>

          <el-col :md="24" :lg="24" class="right-preview">
            <div class="action-bar" :style="{'text-align': 'left'}">
              <span class="bar-btn" @click="switchTo">
                <i class="el-icon-sort" :style="{'color': 'red'}" />
                切换模式
              </span>
              <span class="bar-btn delete-btn" @click="$emit('update:visible', false)">
                <i class="el-icon-circle-close" />
                关闭
              </span>
            </div>
            <el-row :gutter="24">
              <el-col style="border: 1px solid;"  :span="this.topmaster" :offset="this.topoher">
                <iframe
                  v-show="isIframeLoaded"
                  ref="previewPage"
                  class="result-wrapper"
                  frameborder="0"
                  src="preview.html"
                  @load="iframeLoad"
                />
              </el-col>
            </el-row>
            <div v-show="!isIframeLoaded" v-loading="true" class="result-wrapper" />
          </el-col>
        </el-row>
      </div>
    </el-drawer>
    <resource-dialog
      :visible.sync="resourceVisible"
      :origin-resource="resources"
      @save="setResource"
    />
  </div>
</template>
<script>
import { parse } from '@babel/parser'
import { exportDefault } from '@/utils/index'
import ResourceDialog from './ResourceDialog'
import loadMonaco from '@/utils/loadMonaco'
import loadBeautifier from '@/utils/loadBeautifier'

const mode = {
  html: 'html',
  js: 'javascript',
  css: 'css'
}
let beautifier
let monaco

export default {
  components: { ResourceDialog },
  props: ['formData', 'generateConf'],
  data() {
    return {
      topmaster: 24,
      topoher: 0,
      activeTab: 'html',
      htmlCode: '',
      jsCode: '',
      cssCode: '',
      codeFrame: '',
      isIframeLoaded: false,
      isInitcode: false, // 保证open后两个异步只执行一次runcode
      isRefreshCode: false, // 每次打开都需要重新刷新代码
      resourceVisible: false,
      scripts: [],
      links: [],
      monaco: null
    }
  },
  computed: {
    resources() {
      return this.scripts.concat(this.links)
    }
  },
  watch: {},
  created() {
  },


  //后端未搭建，模拟取出数据格式
  mounted() {
      var csss = ".el-upload__tip {\n" +
          "  line-height: 1.2;\n" +
          "}"
      /* getAction(, formData).then((res) => {
         this.uploading = false
         if(res.success){
           if(res.code == 201){
             this.errorTip(res.message, res.result)
           }else{
             this.$message.success(res.message)
           }
           this.visible=false
           this.$emit('ok')
         }else{
           this.$message.warning(res.message)
         }
       })*/
      var htmls ="<el-form ref=\"elForm\" :model=\"formData\" :rules=\"rules\" size=\"medium\" label-width=\"100px\"\n" +
          "  label-position=\"left\">\n" +
          "  <el-form-item label=\"级联选择\" prop=\"field101\">\n" +
          "    <el-cascader v-model=\"formData.field101\" :options=\"field101Options\" :props=\"field101Props\"\n" +
          "      :style=\"{width: '100%'}\" placeholder=\"请选择级联选择\" clearable></el-cascader>\n" +
          "  </el-form-item>\n" +
          "  <el-form-item label=\"单行文本\" prop=\"mobile\">\n" +
          "    <el-input v-model=\"formData.mobile\" placeholder=\"请输入手机号\" :maxlength=\"11\" show-word-limit clearable\n" +
          "      prefix-icon='el-icon-mobile' :style=\"{width: '100%'}\"></el-input>\n" +
          "  </el-form-item>\n" +
          "  <el-form-item label=\"级联选择\" prop=\"field118\">\n" +
          "    <el-cascader v-model=\"formData.field118\" :options=\"field118Options\" :props=\"field118Props\"\n" +
          "      :style=\"{width: '100%'}\" placeholder=\"请选择级联选择\" clearable></el-cascader>\n" +
          "  </el-form-item>\n" +
          "  <el-row>\n" +
          "    <el-row>\n" +
          "    </el-row>\n" +
          "  </el-row>\n" +
          "  <el-form-item label=\"颜色选择\" prop=\"field103\" required>\n" +
          "    <el-color-picker v-model=\"formData.field103\" size=\"medium\"></el-color-picker>\n" +
          "  </el-form-item>\n" +
          "  <el-form-item label=\"按钮\" prop=\"field109\">\n" +
          "    <el-button type=\"primary\" icon=\"el-icon-search\" size=\"medium\"> 主要按钮 </el-button>\n" +
          "  </el-form-item>\n" +
          "  <el-form-item label=\"日期选择\" prop=\"field106\">\n" +
          "    <el-date-picker v-model=\"formData.field106\" format=\"yyyy-MM-dd\" value-format=\"yyyy-MM-dd\"\n" +
          "      :style=\"{width: '100%'}\" placeholder=\"请选择日期选择\" clearable></el-date-picker>\n" +
          "  </el-form-item>\n" +
          "  <el-form-item label=\"下拉选择\" prop=\"field107\">\n" +
          "    <el-select v-model=\"formData.field107\" placeholder=\"请选择下拉选择\" clearable :style=\"{width: '100%'}\">\n" +
          "      <el-option v-for=\"(item, index) in field107Options\" :key=\"index\" :label=\"item.label\" :value=\"item.value\"\n" +
          "        :disabled=\"item.disabled\"></el-option>\n" +
          "    </el-select>\n" +
          "  </el-form-item>\n" +
          "  <el-form-item label=\"单行文本\" prop=\"field117\">\n" +
          "    <el-input v-model=\"formData.field117\" placeholder=\"请输入单行文本\" clearable :style=\"{width: '100%'}\"></el-input>\n" +
          "  </el-form-item>\n" +
          "  <el-form-item label=\"上传\" prop=\"field104\" required>\n" +
          "    <el-upload ref=\"field104\" :file-list=\"field104fileList\" :action=\"field104Action\"\n" +
          "      :before-upload=\"field104BeforeUpload\">\n" +
          "      <el-button size=\"small\" type=\"primary\" icon=\"el-icon-upload\">点击上传</el-button>\n" +
          "    </el-upload>\n" +
          "  </el-form-item>\n" +
          "  <el-form-item label=\"下拉选择\" prop=\"field105\">\n" +
          "    <el-select v-model=\"formData.field105\" placeholder=\"请选择下拉选择\" clearable :style=\"{width: '100%'}\">\n" +
          "      <el-option v-for=\"(item, index) in field105Options\" :key=\"index\" :label=\"item.label\" :value=\"item.value\"\n" +
          "        :disabled=\"item.disabled\"></el-option>\n" +
          "    </el-select>\n" +
          "  </el-form-item>\n" +
          "  <el-form-item label=\"时间范围\" prop=\"field102\">\n" +
          "    <el-time-picker v-model=\"formData.field102\" is-range format=\"HH:mm:ss\" value-format=\"HH:mm:ss\"\n" +
          "      :style=\"{width: '100%'}\" start-placeholder=\"开始时间\" end-placeholder=\"结束时间\" range-separator=\"至\" clearable>\n" +
          "    </el-time-picker>\n" +
          "  </el-form-item>\n" +
          "  <el-form-item size=\"large\">\n" +
          "    <el-button type=\"primary\" @click=\"submitForm\">提交</el-button>\n" +
          "    <el-button @click=\"resetForm\">重置</el-button>\n" +
          "  </el-form-item>\n" +
          "</el-form>"
      var jss ="export default {\n" +
          "  components: {},\n" +
          "  props: [],\n" +
          "  data() {\n" +
          "    return {\n" +
          "      formData: {\n" +
          "        field101: [1, 2],\n" +
          "        mobile: undefined,\n" +
          "        field118: [1, 2],\n" +
          "        field103: null,\n" +
          "        field109: undefined,\n" +
          "        field106: null,\n" +
          "        field107: 1,\n" +
          "        field117: undefined,\n" +
          "        field104: null,\n" +
          "        field105: undefined,\n" +
          "        field102: null,\n" +
          "      },\n" +
          "      rules: {\n" +
          "        field101: [{\n" +
          "          required: true,\n" +
          "          type: 'array',\n" +
          "          message: '请至少选择一个级联选择',\n" +
          "          trigger: 'change'\n" +
          "        }],\n" +
          "        mobile: [{\n" +
          "          required: true,\n" +
          "          message: '请输入手机号',\n" +
          "          trigger: 'blur'\n" +
          "        }, {\n" +
          "          pattern: /^1(3|4|5|7|8|9)\\d{9}$/,\n" +
          "          message: '手机号格式错误',\n" +
          "          trigger: 'blur'\n" +
          "        }],\n" +
          "        field118: [{\n" +
          "          required: true,\n" +
          "          type: 'array',\n" +
          "          message: '请至少选择一个级联选择',\n" +
          "          trigger: 'change'\n" +
          "        }],\n" +
          "        field106: [{\n" +
          "          required: true,\n" +
          "          message: '请选择日期选择',\n" +
          "          trigger: 'change'\n" +
          "        }],\n" +
          "        field107: [{\n" +
          "          required: true,\n" +
          "          message: '请选择下拉选择',\n" +
          "          trigger: 'change'\n" +
          "        }],\n" +
          "        field117: [{\n" +
          "          required: true,\n" +
          "          message: '请输入单行文本',\n" +
          "          trigger: 'blur'\n" +
          "        }],\n" +
          "        field105: [{\n" +
          "          required: true,\n" +
          "          message: '请选择下拉选择',\n" +
          "          trigger: 'change'\n" +
          "        }],\n" +
          "        field102: [{\n" +
          "          required: true,\n" +
          "          message: '时间范围不能为空',\n" +
          "          trigger: 'change'\n" +
          "        }],\n" +
          "      },\n" +
          "      field104Action: 'https://jsonplaceholder.typicode.com/posts/',\n" +
          "      field104fileList: [],\n" +
          "      field101Options: [],\n" +
          "      field118Options: [],\n" +
          "      field107Options: [{\n" +
          "        \"label\": \"选项一\",\n" +
          "        \"value\": 1\n" +
          "      }, {\n" +
          "        \"label\": \"选项二\",\n" +
          "        \"value\": 2\n" +
          "      }],\n" +
          "      field105Options: [{\n" +
          "        \"label\": \"选项一\",\n" +
          "        \"value\": 1\n" +
          "      }, {\n" +
          "        \"label\": \"选项二\",\n" +
          "        \"value\": 2\n" +
          "      }],\n" +
          "      field101Props: {\n" +
          "        \"multiple\": false,\n" +
          "        \"label\": \"label\",\n" +
          "        \"value\": \"value\",\n" +
          "        \"children\": \"children\"\n" +
          "      },\n" +
          "      field118Props: {\n" +
          "        \"multiple\": false,\n" +
          "        \"label\": \"label\",\n" +
          "        \"value\": \"value\",\n" +
          "        \"children\": \"children\"\n" +
          "      },\n" +
          "    }\n" +
          "  },\n" +
          "  computed: {},\n" +
          "  watch: {},\n" +
          "  created() {\n" +
          "    this.getField101Options()\n" +
          "    this.getField118Options()\n" +
          "  },\n" +
          "  mounted() {},\n" +
          "  methods: {\n" +
          "    submitForm() {\n" +
          "      this.$refs['elForm'].validate(valid => {\n" +
          "        if (!valid) return\n" +
          "        // TODO 提交表单\n" +
          "      })\n" +
          "    },\n" +
          "    resetForm() {\n" +
          "      this.$refs['elForm'].resetFields()\n" +
          "    },\n" +
          "    getField101Options() {\n" +
          "      // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的\n" +
          "      this.$axios({\n" +
          "        method: 'get',\n" +
          "        url: 'https://www.fastmock.site/mock/f8d7a54fb1e60561e2f720d5a810009d/fg/cascaderList'\n" +
          "      }).then(resp => {\n" +
          "        var {\n" +
          "          data\n" +
          "        } = resp\n" +
          "        this.field101Options = data.list\n" +
          "      })\n" +
          "    },\n" +
          "    getField118Options() {\n" +
          "      // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的\n" +
          "      this.$axios({\n" +
          "        method: 'get',\n" +
          "        url: 'https://www.fastmock.site/mock/f8d7a54fb1e60561e2f720d5a810009d/fg/cascaderList'\n" +
          "      }).then(resp => {\n" +
          "        var {\n" +
          "          data\n" +
          "        } = resp\n" +
          "        this.field118Options = data.list\n" +
          "      })\n" +
          "    },\n" +
          "    field104BeforeUpload(file) {\n" +
          "      let isRightSize = file.size / 1024 / 1024 < 2\n" +
          "      if (!isRightSize) {\n" +
          "        this.$message.error('文件大小超过 2MB')\n" +
          "      }\n" +
          "      return isRightSize\n" +
          "    },\n" +
          "  }\n" +
          "}"

      this.htmlCode=htmls
      this.jsCode=jss
      this.cssCode=csss

  },
  beforeDestroy() {
      console.log("11");
    window.removeEventListener('keydown', this.preventDefaultSave)
  },
  methods: {
    preventDefaultSave(e) {
        console.log("10");
      if (e.key === 's' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
      }
    },
      //数据处理
    onOpen() {
      console.log("9");
      const { type } = this.generateConf
      loadBeautifier(btf => {
        loadMonaco(val => {
          monaco = val
          this.setEditorValue('editorHtml', 'html', this.htmlCode)
          this.setEditorValue('editorJs', 'js', this.jsCode)
          this.setEditorValue('editorCss', 'css', this.cssCode)
          if (!this.isInitcode) {
            this.isRefreshCode = true
            this.isIframeLoaded && (this.isInitcode = true) && this.runCode()
          }
        })
      })
    },
    setEditorValue(id, codeStr) {
        if (this.jsonEditor) {
            this.jsonEditor.setValue(codeStr)
        } else {
            this.jsonEditor = monaco.editor.create(document.getElementById(id), {
                value: codeStr,
                theme: 'vs-dark',
                language: 'json',
                automaticLayout: true
            })
            // ctrl + s 刷新
            this.jsonEditor.onKeyDown(e => {
                if (e.keyCode === 49 && (e.metaKey || e.ctrlKey)) {
                    this.refresh()
                }
            })
        }
    },
    onClose() {
        console.log("8");
      this.isInitcode = false
      this.isRefreshCode = false
    },
    iframeLoad() {
      console.log("7");
      if (!this.isInitcode) {
        this.isIframeLoaded = true
        this.isRefreshCode && (this.isInitcode = true) && this.runCode()
      }
    },
      //运行样式进行渲染展示
    runCode() {
        console.log("5");
      const jsCodeStr =this.jsCode
      try {
        const ast = parse(jsCodeStr, { sourceType: 'module' })
        const astBody = ast.program.body
        if (astBody.length > 1) {
          this.$confirm(
            'js格式不能识别，仅支持修改export default的对象内容',
            '提示',
            {
              type: 'warning'
            }
          )
          return
        }
        if (astBody[0].type === 'ExportDefaultDeclaration') {
          const postData = {
            type: 'refreshFrame',
            data: {
              generateConf: this.generateConf,
              html: this.htmlCode,
              js: jsCodeStr.replace(exportDefault, ''),
              css: this.cssCode,
              scripts: this.scripts,
              links: this.links
            }
          }

          this.$refs.previewPage.contentWindow.postMessage(
            postData,
            location.origin
          )
        } else {
          this.$message.error('请使用export default')
        }
      } catch (err) {
        this.$message.error(`js错误：${err}`)
        console.error(err)
      }
    },

    switchTo() {
      if(this.topmaster === 24){
        this.topmaster = 8
        this.topoher = 8
      }else {
        this.topmaster = 24
        this.topoher = 0
      }
    },
    showResource() {
        console.log("2");
      this.resourceVisible = true
    },
    setResource(arr) {
        console.log("1");
      const scripts = []; const
        links = []
      if (Array.isArray(arr)) {
        arr.forEach(item => {
          if (item.endsWith('.css')) {
            links.push(item)
          } else {
            scripts.push(item)
          }
        })
        this.scripts = scripts
        this.links = links
      } else {
        this.scripts = []
        this.links = []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
.tab-editor {
  position: absolute;
  top: 33px;
  bottom: 0;
  left: 0;
  right: 0;
  font-size: 14px;
}
.left-editor {
  position: relative;
  height: 100%;
  background: #1e1e1e;
  overflow: hidden;
}
.setting{
  position: absolute;
  right: 15px;
  top: 3px;
  color: #a9f122;
  font-size: 18px;
  cursor: pointer;
  z-index: 1;
}
.right-preview {
  height: 100%;
  .result-wrapper {
    height: calc(100vh - 33px);
    width: 100%;
    overflow: auto;
    padding: 12px;
    box-sizing: border-box;
  }
}
@include action-bar;
::v-deep .el-drawer__header {
  display: none;
}
</style>
