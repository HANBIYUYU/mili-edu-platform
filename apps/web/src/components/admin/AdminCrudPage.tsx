import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Table, Button, Modal, Form, Input, InputNumber, Select, Switch, Space, Popconfirm, message, Spin, Tag,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, SearchOutlined, PictureOutlined, LinkOutlined,
} from '@ant-design/icons';
import { MediaPickerModal, type MediaKind } from './MediaLibrary';
import { fileUrl, isAudioKey, isDocKey, isImageKey, isVideoKey } from '../../utils/fileUrl';

const { TextArea } = Input;

export interface CrudField {
  name: string;
  label: string;
  type?: 'text' | 'textarea' | 'number' | 'select' | 'switch' | 'media';
  options?: { value: string | number; label: string }[];
  /** media 字段可限定素材类型 */
  kinds?: MediaKind[];
  required?: boolean;
  span?: 1 | 2;
  placeholder?: string;
  extra?: string;
}

export interface CrudApi {
  list: (params?: any) => Promise<{ list: any[] }>;
  create?: (data: any) => Promise<any>;
  update?: (id: any, data: any) => Promise<any>;
  remove?: (id: any) => Promise<any>;
}

export interface CrudConfig {
  title: string;
  rowKey: string;
  api: CrudApi;
  columns: any[];
  fields: CrudField[];
  defaultValues?: Record<string, any>;
  /** 列表请求固定附加参数 */
  listParams?: Record<string, any>;
  /** 新增/保存时固定写入的字段 */
  fixedValues?: Record<string, any>;
}

const SORTABLE = new Set(['id', 'created_at', 'sort_order', 'year']);

function useSmartColumns(config: CrudConfig, rows: any[]) {
  return useMemo(() => {
    const counts: Record<string, Set<string>> = {};
    rows.forEach((r) => {
      config.columns.forEach((c) => {
        const v = r[c.dataIndex];
        if (v == null || ['string', 'number'].indexOf(typeof v) < 0) return;
        (counts[c.dataIndex] ??= new Set()).add(String(v));
      });
    });
    return config.columns.map((c: any) => {
      const col: any = { ...c };
      if (!col.title) return col;
      if (SORTABLE.has(c.dataIndex) && !col.sorter) {
        col.sorter = (a: any, b: any) => ((a[c.dataIndex] ?? '') > (b[c.dataIndex] ?? '') ? 1 : -1);
      }
      const values = counts[c.dataIndex];
      if (values && values.size > 1 && values.size <= 12 && c.render === undefined && !col.filters) {
        col.filters = [...values].sort().map((v) => ({ text: v, value: v }));
        col.onFilter = (v: any, r: any) => String(r[c.dataIndex]) === String(v);
      }
      if (c.ellipsis === undefined && !c.width) col.ellipsis = true;
      return col;
    });
  }, [config, rows]);
}

/** 素材字段：输入 R2 key + 「素材库」选择（自动预览），不必手填路径 */
function MediaInput({ value, onChange, kinds, placeholder }: {
  value?: string;
  onChange?: (v: string) => void;
  kinds?: MediaKind[];
  placeholder?: string;
}) {
  const [pick, setPick] = useState(false);
  const url = fileUrl(value);
  return (
    <>
      <Space.Compact style={{ width: '100%' }}>
        <Input
          value={value || ''}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder || 'R2 key，如 artworks/202608/xxx.jpg，或点击右侧选择'}
        />
        <Button icon={<PictureOutlined />} onClick={() => setPick(true)}>素材库</Button>
      </Space.Compact>
      {value && (
        <div style={{ marginTop: 6 }}>
          {isImageKey(value) ? (
            <img
              src={url} alt="预览" style={{ maxWidth: '100%', maxHeight: 120, borderRadius: 8, border: '1px solid #f0f0f0' }}
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
          ) : isVideoKey(value) ? (
            <video src={url} controls muted preload="metadata" style={{ width: '100%', maxHeight: 200, borderRadius: 8, background: '#000' }} />
          ) : isAudioKey(value) ? (
            <audio src={url} controls style={{ maxWidth: '100%' }} />
          ) : isDocKey(value) ? (
            <a href={url} target="_blank" rel="noreferrer"><LinkOutlined /> 打开文件 {value.split('/').pop()}</a>
          ) : null}
        </div>
      )}
      <MediaPickerModal
        open={pick}
        onCancel={() => setPick(false)}
        onSelect={(k) => { onChange?.(k); setPick(false); }}
        kinds={kinds}
      />
    </>
  );
}

/** 通用管理端 CRUD 页：搜索 + 列筛选/排序 + 新增/编辑（素材字段走素材库选择） */
export default function AdminCrudPage({ config }: { config: CrudConfig }) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [kw, setKw] = useState('');
  const [form] = Form.useForm();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await config.api.list({ pageSize: 500, ...config.listParams });
      const next = (res && res.list) || [];
      setRows(next);
      return next;
    } catch {
      message.error('数据加载失败');
      return [];
    } finally {
      setLoading(false);
    }
  }, [config]);

  useEffect(() => { load(); }, [load]);

  // 切回页面自动刷新
  useEffect(() => {
    const onActive = () => { if (document.visibilityState === 'visible') load(); };
    window.addEventListener('focus', onActive);
    document.addEventListener('visibilitychange', onActive);
    return () => {
      window.removeEventListener('focus', onActive);
      document.removeEventListener('visibilitychange', onActive);
    };
  }, [load]);

  const filtered = useMemo(() => {
    if (!kw.trim()) return rows;
    const q = kw.trim().toLowerCase();
    return rows.filter((r) => JSON.stringify(Object.values(r)).toLowerCase().includes(q));
  }, [rows, kw]);

  const smartColumns = useSmartColumns(config, rows);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    if (config.defaultValues) form.setFieldsValue(config.defaultValues);
    if (config.fixedValues) form.setFieldsValue(config.fixedValues);
    setOpen(true);
  };

  const openEdit = (row: any) => {
    setEditing(row);
    form.resetFields();
    const init: any = { ...row };
    // switch 数值(0/1) → 布尔
    config.fields.forEach((f) => {
      if (f.type === 'switch') init[f.name] = !!Number(row[f.name]);
    });
    form.setFieldsValue(init);
    setOpen(true);
  };

  const onSave = async () => {
    const raw = await form.validateFields();
    const values: any = { ...raw };
    config.fields.forEach((f) => {
      if (f.type === 'switch') values[f.name] = values[f.name] ? 1 : 0;
      // 空字符串归一化为 null，避免后端 COALESCE 误覆盖
      if (values[f.name] === '') values[f.name] = null;
    });
    setSaving(true);
    try {
      if (editing) {
        await config.api.update?.(editing[config.rowKey], values);
        message.success('已保存');
      } else {
        await config.api.create?.({ ...config.fixedValues, ...values });
        message.success('已新增');
      }
      setOpen(false);
      load();
    } catch (e: any) {
      message.error(e?.error || '保存失败');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (row: any) => {
    try {
      await config.api.remove?.(row[config.rowKey]);
      const fresh = await load();
      if (fresh.some((r: any) => r[config.rowKey] === row[config.rowKey])) {
        message.error('删除未生效：记录仍在列表中，请稍后重试');
      } else {
        message.success('已删除');
      }
    } catch (e: any) {
      message.error(e?.error || '删除失败');
    }
  };

  const actionColumn = {
    title: '操作',
    key: '_actions',
    width: 130,
    fixed: 'right' as const,
    render: (_: any, row: any) => (
      <Space size={4}>
        {config.api.update && (
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(row)}>编辑</Button>
        )}
        {config.api.remove && (
          <Popconfirm title="确认删除？" description="删除后不可恢复" onConfirm={() => onDelete(row)}>
            <Button size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        )}
      </Space>
    ),
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 20 }}>{config.title}</h2>
        <Space wrap>
          <Input
            allowClear
            prefix={<SearchOutlined style={{ color: '#bbb' }} />}
            placeholder="搜索关键词…"
            value={kw}
            onChange={(e) => setKw(e.target.value)}
            style={{ width: 220 }}
          />
          <Button icon={<ReloadOutlined />} onClick={load}>刷新</Button>
          {config.api.create && (
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>新增</Button>
          )}
        </Space>
      </div>

      <Spin spinning={loading}>
        <Table
          rowKey={config.rowKey}
          columns={[...smartColumns, actionColumn]}
          dataSource={filtered}
          pagination={{ pageSize: 18, showSizeChanger: false, showTotal: (t) => `共 ${t} 条` }}
          scroll={{ x: 'max-content', y: 'max(300px, calc(100vh - 330px))' }}
          size="middle"
        />
      </Spin>

      <Modal
        title={editing ? `编辑${config.title}` : `新增${config.title}`}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={onSave}
        confirmLoading={saving}
        width={760}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          {config.fields.map((f) => (
            <Form.Item
              key={f.name}
              name={f.name}
              label={f.label}
              extra={f.extra}
              rules={f.required ? [{ required: true, message: `请填写${f.label}` }] : undefined}
              style={f.span === 1 ? { display: 'inline-block', width: '48%', marginRight: '2%' } : undefined}
            >
              {f.type === 'textarea' ? (
                <TextArea rows={3} placeholder={f.placeholder} />
              ) : f.type === 'number' ? (
                <InputNumber style={{ width: '100%' }} placeholder={f.placeholder} />
              ) : f.type === 'select' ? (
                <Select options={f.options} placeholder={f.placeholder} allowClear />
              ) : f.type === 'switch' ? (
                <Switch checkedChildren="是" unCheckedChildren="否" />
              ) : f.type === 'media' ? (
                <MediaInput kinds={f.kinds} placeholder={f.placeholder} />
              ) : (
                <Input placeholder={f.placeholder} />
              )}
            </Form.Item>
          ))}
        </Form>
      </Modal>
    </div>
  );
}

export { Tag };
