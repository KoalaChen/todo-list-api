import { beforeAll, expect, test } from 'vitest';
import fetch from 'node-fetch'
import { ErrorResult } from '../errorResult';
import { SuccessResult } from '../successResult';

let baseUrl = 'http://localhost:3005';
type NewTodoType = {
    title: string
};
type TodoType = {
  readonly id: string;
  title: string;
  completed: boolean;
};
type SuccessTodoReturn = {
  readonly status: string;
  readonly data: readonly TodoType[];
}
beforeAll(async () => {
  await fetch(`${baseUrl}/reset`, { method: 'DELETE' });
});

test('GET /todos 應回傳 200 OK', async ({}) => {
  // arrange
  const url = `${baseUrl}/todos`;
  const expectedStatue = 200;
  // act
  const res = await fetch(url);
  // assert
  expect(res.status).toBe(expectedStatue);
});

test('GET /todos 應回傳空陣列', async ({}) => {
  // arrange
  const url = `${baseUrl}/todos`;
  const expected: SuccessTodoReturn = {
    status: "success",
    data: []
  };
  // act
  const res = await fetch(url);
  const data = await res.json();
  // assert
  expect(data).toEqual(expected);
});
test('GET /todos/ 應回傳空陣列', async ({}) => {
  // arrange
  const url = `${baseUrl}/todos`;
  const expected: SuccessTodoReturn = {
    status: "success",
    data: []
  };
  // act
  const res = await fetch(url);
  const data = await res.json();
  // assert
  expect(data).toEqual(expected);
});

test('錯誤網址，應回傳 404', async ({}) => {
  // arrange
  const url = `${baseUrl}/xxx`;
  const expectedStatue = 404;
  const expectedResult = {
    message: "Not found",
    status: "error"
  };
  // act
  const res = await fetch(url);
  const actual = await res.json();
  // assert
  expect(res.status).toBe(expectedStatue);
  expect(actual).toEqual(expectedResult);
});
test('新增待辦POST-1筆，結果應有1筆', async () => {
  // arrange
  const url = `${baseUrl}/todos`;
  const newTodo: NewTodoType = {
    title: '第一筆待辦'
  };
  const expectedStatus = 200;
  const exportData: SuccessTodoReturn = {
    status: "success",
    data: [{
      id: expect.any(String),
      title: newTodo.title,
      completed: false
    }]
  };

  // act
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTodo)
  });
  const data = await res.json();
  // assert
  expect(res.status).toBe(expectedStatus);
  expect(data).toEqual(exportData);
});
test('新增待辦POST-第2筆，結果應有2筆', async () => {
  // arrange
  const url = `${baseUrl}/todos/`;
  const newTodo: NewTodoType = {
    title: '第二筆待辦'
  };
  const expectedStatus = 200;
  const exportData: SuccessTodoReturn = {
    status: "success",
    data: [{
      id: expect.any(String),
      title: '第一筆待辦',
      completed: false
    },
    {
      id: expect.any(String),
      title: '第二筆待辦',
      completed: false
    }]
  };

  // act
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTodo)
  });
  const data = await res.json();
  // assert
  expect(res.status).toBe(expectedStatus);
  expect(data).toEqual(exportData);
});
test('新增待辦POST，結果應有id屬性', async () => {
  // arrange
  const url = `${baseUrl}/todos`;
  const newTodo: NewTodoType = {
    title: '第三筆待辦'
  };
  const expectedStatus = 200;
  const exportData: SuccessTodoReturn = {
    status: "success",
    data: [{
      id: expect.any(String),
      title: newTodo.title,
      completed: false
    }]
  };

  // act
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTodo)
  });
  const data = (await res.json()) as SuccessTodoReturn;
  // assert
  expect(data.data[0].id).not.null;
});
test('新增待辦POST-資料空值，應回傳400錯誤', async () => {
  // arrange
  const url = `${baseUrl}/todos`;
  const newTodo: NewTodoType = {
    title: ''
  };
  const expectedStatus = 400;
  const exportData: ErrorResult = {
    status: "error",
    message: "欄位未填寫正確"
  };

  // act
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTodo)
  });
  const data = await res.json();
  // assert
  expect(res.status).toBe(expectedStatus);
  expect(data).toEqual(exportData);
});
test('新增待辦POST-JSON 格式有誤，應回傳400錯誤', async () => {
  // arrange
  const url = `${baseUrl}/todos`;
  const newTodo: NewTodoType = {
    title: ''
  };
  const expectedStatus = 400;
  const exportData: ErrorResult = {
    status: "error",
    message: "欄位未填寫正確"
  };

  // act
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{aaa}'
  });
  const data = await res.json();
  // assert
  expect(res.status).toBe(expectedStatus);
  expect(data).toEqual(exportData);
});
test('新增待辦POST-資料是 null，應回傳400錯誤', async () => {
  // arrange
  const url = `${baseUrl}/todos`;
  const newTodo: NewTodoType = {
    title: ''
  };
  const expectedStatus = 400;
  const exportData: ErrorResult = {
    status: "error",
    message: "欄位未填寫正確"
  };

  // act
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: 'null'
  });
  const data = await res.json();
  // assert
  expect(res.status).toBe(expectedStatus);
  expect(data).toEqual(exportData);
});
test('修改待辦PATCH-標題應修改成功', async () => {
  // arrange
  // 取得第一筆待辦
  const url = `${baseUrl}/todos`;
  const todoList: SuccessResult = await (await fetch(url)).json() as SuccessResult;
  const todo = todoList.data[0];
  // 修改成已完成
  const editUrl = `${baseUrl}/todos/${todo.id}`;
  const editedTodo: Partial<TodoType> = {
    title: '已完成的待辦',
    completed: true
  };
  const expected: TodoType = {
      id: todo.id,
      title: '已完成的待辦',
      completed: true
    };
  const expectedStatus = 200;
  // act
  const res = await fetch(editUrl, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(editedTodo)
  })
  const data = await res.json();
  // assert
  expect(res.status).toBe(expectedStatus);
  expect(data).toEqual(expected);
});
test('修改待辦PATCH-標題空值，應修改失敗', async () => {
  // arrange
  // 取得第一筆待辦
  const url = `${baseUrl}/todos`;
  const todoList: SuccessResult = await (await fetch(url)).json() as SuccessResult;
  const todo = todoList.data[0];
  // 修改成已完成
  const editUrl = `${baseUrl}/todos/${todo.id}`;
  const editedTodo: Partial<TodoType> = {
    title: '',
    completed: true
  };
  const expected: ErrorResult = {
      status: 'error',
      message: '欄位未填寫正確'
    };
  const expectedStatus = 400;
  // act
  const res = await fetch(editUrl, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(editedTodo)
  })
  const data = await res.json();
  // assert
  expect(res.status).toBe(expectedStatus);
  expect(data).toEqual(expected);
});
test('修改待辦PATCH-JSON格式錯誤，應修改失敗', async () => {
  // arrange
  // 取得第一筆待辦
  const url = `${baseUrl}/todos`;
  const todoList: SuccessResult = await (await fetch(url)).json() as SuccessResult;
  const todo = todoList.data[0];
  // 修改成已完成
  const editUrl = `${baseUrl}/todos/${todo.id}`;
  const expected: ErrorResult = {
      status: 'error',
      message: '欄位未填寫正確'
    };
  const expectedStatus = 400;
  // act
  const res = await fetch(editUrl, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: '{invalid}'
  })
  const data = await res.json();
  // assert
  expect(res.status).toBe(expectedStatus);
  expect(data).toEqual(expected);
});
test('修改待辦PATCH-資料不存在，應回傳404', async () => {
  // arrange
  // 修改成已完成
  const editUrl = `${baseUrl}/todos/fakeId`;
  const expected: ErrorResult = {
      status: 'error',
      message: '找不到資料'
    };
  const expectedStatus = 404;
  // act
  const res = await fetch(editUrl, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: '{}'
  })
  const data = await res.json();
  // assert
  expect(res.status).toBe(expectedStatus);
  expect(data).toEqual(expected);
});
test('DELETE-移除資料不存在，應回傳404', async () => {
  // arrange
  // 修改成已完成
  const editUrl = `${baseUrl}/todos/fakeId`;
  const expected: ErrorResult = {
      status: 'error',
      message: '找不到欲刪除之待辦事項'
    };
  const expectedStatus = 404;
  // act
  const res = await fetch(editUrl, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  })
  const data = await res.json();
  // assert
  expect(res.status).toBe(expectedStatus);
  expect(data).toEqual(expected);
});
test('DELETE 移除一筆資料，結果會少1筆', async () => {
  // arrange
  // 取得第一筆待辦
  const url = `${baseUrl}/todos`;
  const todoList: SuccessResult = await (await fetch(url)).json() as SuccessResult;
  const todo = todoList.data[0];
  // arrange
  const deleteItemUrl = `${baseUrl}/todos/${todo.id}`;
  const expectedStatus = 200;
  const exportData: SuccessTodoReturn = {
    status: "success",
    data: todoList.data.slice(1)
  };

  // act
  const res = await fetch(deleteItemUrl, {
    method: 'DELETE'
  });
  const data = await res.json();
  // assert
  expect(res.status).toBe(expectedStatus);
  expect(data).toEqual(exportData);
  expect(res.headers.get('Content-Type')).toBe('application/json');
});
test('DELETE 全部資料，結果應有0筆', async () => {
  // arrange
  const url = `${baseUrl}/todos/removeAll`;
  const expectedStatus = 200;
  const exportData: SuccessTodoReturn = {
    status: "success",
    data: []
  };

  // act
  const res = await fetch(url, {
    method: 'DELETE'
  });
  const data = await res.json();
  // assert
  expect(res.status).toBe(expectedStatus);
  expect(data).toEqual(exportData);
  expect(res.headers.get('Content-Type')).toBe('application/json');
});

test('OPTIONS 取得CORS', async () => {
  // arrange
  const url = `${baseUrl}/todos`;
  const expectedStatus = 200;

  // act
  const res = await fetch(url, {
    method: 'OPTIONS'
  });
  // assert
  expect(res.status).toBe(expectedStatus);
});