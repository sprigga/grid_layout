// 保存所有網格的引用
let grids = [];

// 初始化保存的網格
function initializeGrids(savedGrids) {
    savedGrids.forEach(grid => {
        createGrid(grid.id, grid.x, grid.y, grid.width, grid.height);
    });
}

// 創建新網格
function createGrid(id, x, y, width, height) {
    const gridId = id || 0;
    const gridDiv = $('<div>')
        .addClass('grid')
        .css({
            'position': 'absolute',
            'width': width + 'px',
            'height': height + 'px',
            'background-color': 'rgba(0, 123, 255, 0.5)',
            'border': '1px solid #0056b3',
            'cursor': 'move',
            'user-select': 'none',
            'z-index': '100',
            'left': x + 'px',
            'top': y + 'px'
        })
        .attr('data-id', gridId)
        .attr('data-x', x)
        .attr('data-y', y)
        .attr('data-width', width)
        .attr('data-height', height);

    // 添加調整大小的手柄
    $('<div>')
        .addClass('resize-handle')
        .css({
            'width': '10px',
            'height': '10px',
            'background-color': '#0056b3',
            'position': 'absolute',
            'right': '0',
            'bottom': '0',
            'cursor': 'se-resize'
        })
        .appendTo(gridDiv);

    // 添加刪除按鈕
    $('<button>')
        .addClass('delete-btn')
        .text('X')
        .css({
            'position': 'absolute',
            'top': '2px',
            'right': '2px',
            'background-color': 'red',
            'color': 'white',
            'border': 'none',
            'border-radius': '50%',
            'width': '20px',
            'height': '20px',
            'line-height': '18px',
            'font-size': '12px',
            'cursor': 'pointer',
            'z-index': '101'
        })
        .on('click', function(e) {
            e.stopPropagation();
            deleteGrid(gridDiv);
        })
        .appendTo(gridDiv);

    // 添加網格到容器
    $('#background-container').append(gridDiv);

    // 使網格可拖動
    gridDiv.draggable({
        containment: '#background-container',
        start: function() {
            // 將當前網格置於最上層
            $(this).css('z-index', '101');
            $('.grid').not(this).css('z-index', '100');
        },
        stop: function(event, ui) {
            const id = parseInt($(this).attr('data-id'));
            const x = ui.position.left;
            const y = ui.position.top;
            const width = parseInt($(this).css('width'));
            const height = parseInt($(this).css('height'));
            
            // 檢查是否與其他網格重疊
            if (checkOverlap(id, x, y, width, height)) {
                // 如果重疊，恢復到原始位置
                ui.helper.css({
                    'left': $(this).attr('data-x') + 'px',
                    'top': $(this).attr('data-y') + 'px'
                });
                alert('網格不能重疊！');
                return;
            }
            
            // 更新網格屬性
            $(this).attr('data-x', x);
            $(this).attr('data-y', y);
            
            // 保存更新後的網格
            saveGrid(id, x, y, width, height);
        }
    });

    // 使網格可調整大小
    gridDiv.find('.resize-handle').draggable({
        containment: '#background-container',
        start: function(event, ui) {
            $(this).data('startX', event.clientX);
            $(this).data('startY', event.clientY);
            $(this).data('startWidth', parseInt(gridDiv.css('width')));
            $(this).data('startHeight', parseInt(gridDiv.css('height')));
        },
        drag: function(event, ui) {
            const dx = event.clientX - $(this).data('startX');
            const dy = event.clientY - $(this).data('startY');
            const newWidth = $(this).data('startWidth') + dx;
            const newHeight = $(this).data('startHeight') + dy;
            
            // 設置最小大小
            if (newWidth >= 50 && newHeight >= 50) {
                gridDiv.css({
                    'width': newWidth + 'px',
                    'height': newHeight + 'px'
                });
                
                // 重置手柄位置
                ui.position.left = 0;
                ui.position.top = 0;
            }
        },
        stop: function() {
            const id = parseInt(gridDiv.attr('data-id'));
            const x = parseInt(gridDiv.attr('data-x'));
            const y = parseInt(gridDiv.attr('data-y'));
            const width = parseInt(gridDiv.css('width'));
            const height = parseInt(gridDiv.css('height'));
            
            // 檢查調整大小後是否與其他網格重疊
            if (checkOverlap(id, x, y, width, height)) {
                // 如果重疊，恢復到原始大小
                gridDiv.css({
                    'width': gridDiv.attr('data-width') + 'px',
                    'height': gridDiv.attr('data-height') + 'px'
                });
                alert('調整後的網格不能與其他網格重疊！');
                return;
            }
            
            // 更新網格屬性
            gridDiv.attr('data-width', width);
            gridDiv.attr('data-height', height);
            
            // 保存更新後的網格
            saveGrid(id, x, y, width, height);
        }
    });

    // 新網格需要保存到服務器
    if (!id) {
        // API呼叫保存新網格
        $.ajax({
            url: '/Grid/AddGrid',
            type: 'POST',
            data: {
                X: x,
                Y: y,
                Width: width,
                Height: height
            },
            success: function(response) {
                if (response.success) {
                    // 更新網格ID
                    gridDiv.attr('data-id', response.grid.id);
                    // 將新網格添加到數組中
                    grids.push(gridDiv);
                }
            }
        });
    } else {
        // 將現有網格添加到數組中
        grids.push(gridDiv);
    }
}

// 檢查網格是否與其他網格重疊
function checkOverlap(id, x, y, width, height) {
    let overlap = false;
    $('.grid').each(function() {
        const otherId = parseInt($(this).attr('data-id'));
        if (otherId !== id) {
            const otherX = parseInt($(this).attr('data-x'));
            const otherY = parseInt($(this).attr('data-y'));
            const otherWidth = parseInt($(this).attr('data-width'));
            const otherHeight = parseInt($(this).attr('data-height'));
            
            // 檢查矩形是否重疊
            if (x < otherX + otherWidth &&
                x + width > otherX &&
                y < otherY + otherHeight &&
                y + height > otherY) {
                overlap = true;
                return false; // 跳出each循環
            }
        }
    });
    return overlap;
}

// 保存網格位置和大小
function saveGrid(id, x, y, width, height) {
    $.ajax({
        url: '/Grid/UpdateGrid',
        type: 'POST',
        data: {
            Id: id,
            X: x,
            Y: y,
            Width: width,
            Height: height
        }
    });
}

// 刪除網格
function deleteGrid(gridDiv) {
    const id = parseInt(gridDiv.attr('data-id'));
    
    $.ajax({
        url: '/Grid/DeleteGrid',
        type: 'POST',
        data: { id: id },
        success: function(response) {
            if (response.success) {
                // 從DOM和數組中移除網格
                gridDiv.remove();
                grids = grids.filter(g => parseInt($(g).attr('data-id')) !== id);
            }
        }
    });
}

// 添加網格按鈕點擊事件
$(document).ready(function() {
    $('#addGridBtn').on('click', function() {
        const width = parseInt($('#gridWidth').val()) || 100;
        const height = parseInt($('#gridHeight').val()) || 100;
        
        // 在容器中心創建網格
        const containerWidth = $('#background-container').width();
        const containerHeight = $('#background-container').height();
        const x = (containerWidth - width) / 2;
        const y = (containerHeight - height) / 2;
        
        // 檢查是否與現有網格重疊
        if (checkOverlap(0, x, y, width, height)) {
            alert('新網格與現有網格重疊！請嘗試不同的位置或大小。');
            return;
        }
        
        createGrid(null, x, y, width, height);
    });
});