import { Select, Form, DatePicker, Button, Modal} from 'antd'
import axios from 'axios';
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import moment from 'moment';

const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 4,
    span: 16,
  },
};

function ExportReport() {
  const [form] = Form.useForm()
  const downloadXLXS = async()=>{
    const data = form.getFieldsValue()
    try{
      const dataURI = await axios.post('/dowload-xlsx',data,{responseType:'arraybuffer'})
      const blob = new Blob([dataURI.data as any])
      saveAs(blob,`${data.report}-${dayjs(data.selectedDate).format('YYYY-MM-DD')}.xlsx`)
    }
    catch(e){
      Modal.error({
        title: 'มีข้อผิดพลาด',
        content: 'ไม่สามารถดาวน์โหลดไฟล์ได้',
      });
    }

  }
  return (

      <Form
      form={form}
      {...layout}
      initialValues={
        {
          station:'สถานีประปาพงเพชร',
          report :'SL_SHOP2',
          selectedDate:moment()
        }
      }
      >

        <Form.Item label="เลือกสถานี" name="station" 
        rules={[
          {required:true}
        ]}>
          <Select>
              <Select.Option value="สถานีประปาสำแล">สถานีประปาสำแล</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="เลือกรายงาน" name="report"
        rules={[
          {required:true}
        ]}>
          <Select>
          <Select.Option value="SL_SHOP2">SL_SHOP2</Select.Option>
          <Select.Option value="SL_SHOP3">SL_SHOP3</Select.Option>
          <Select.Option value="SL_SHOP4">SL_SHOP4</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="วันที่ของรายงาน" name="selectedDate"
        rules={[
          {required:true}
        ]}>
          <DatePicker mode='date'/>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button style={{marginRight:'24px'}} type="primary" htmlType="button" onClick={downloadXLXS}>XLXS</Button>
        </Form.Item>
      </Form>
    
  )
}

export default ExportReport
