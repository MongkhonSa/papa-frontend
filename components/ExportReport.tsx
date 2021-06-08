import { Select, Form, DatePicker, Button, Row, Col } from 'antd'
import axios from 'axios';
import { saveAs } from 'file-saver';

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
function dataURItoBlob(dataURI:string) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);

  // create a view into the buffer
  var ia = new Uint8Array(ab);

  // set the bytes of the buffer to the correct values
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  var blob = new Blob([ab], {type: mimeString});
  return blob;

}

function ExportReport() {
  const [form] = Form.useForm()
  const downloadPDF = async()=>{
    const data = form.getFieldsValue()
    const dataURI = await axios.post('/test',data)
    console.log('data',data)
    // const fileName = 'test'
    //   saveAs(dataURItoBlob(''), fileName);
    console.log(dataURI.data)
  
  }
  return (
    
      <Form
      form={form}
      {...layout}
      initialValues={
        {
          station:'สถานีประปาพงเพชร',
          report :'รายงาน',
          date:null,
        }
      }
      >

        <Form.Item label="เลือกสถานี" name="station" 
        rules={[
          {required:true}
        ]}>
          <Select>
              <Select.Option value="สถานีประปาพงเพชร">สถานีประปาพงเพชร</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="เลือกรายงาน" name="report"
        rules={[
          {required:true}
        ]}>
          <Select>
              <Select.Option value="รายงาน">รายงาน</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="วันที่ของรายงาน" name="filterDate"
        rules={[
          {required:true}
        ]}>
          <DatePicker mode='date'/>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button style={{marginRight:'24px'}} type="primary" htmlType="button" onClick={downloadPDF}>PDF</Button>
          <Button type="primary" htmlType="button">XLXS</Button>
        </Form.Item>
      </Form>
    
  )
}

export default ExportReport
