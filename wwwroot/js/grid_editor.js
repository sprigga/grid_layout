// wwwroot/js/grid_editor.js
$(document).ready(function () {
    console.log("grid_editor.js 文件已開始執行");
    
    // 驗証jQuery版本
    console.log("jQuery版本:", $.fn.jquery);
    
    // 明確檢查jQuery UI是否存在
    if (typeof $.ui === 'undefined') {
        console.error('jQuery UI 未加載。請確保引用了正確的jQuery UI腳本。');
        return;
    }
    
    // 打印jQuery UI版本
    console.log("jQuery UI版本:", $.ui.version);
    
    // 檢查必要的jQuery UI組件是否存在
    if (!$.fn.draggable) {
        console.error('jQuery UI draggable組件未加載。');
        return;
    }
    
    if (!$.fn.resizable) {
        console.error('jQuery UI resizable組件未加載。');
        return;
    }
    
    console.log("jQuery UI 組件檢查完成，所有必要組件已加載");
    
    const gridContainer = $('#grid-container');
    let gridCounter = 0;

    // 確認 grid-container 是否存在
    if (!gridContainer.length) {
        console.error('Grid container not found!');
        return;
    }

    loadGrids();

    $('#add-grid').click(function () {
        const width = parseInt($('#grid-width').val()) || 100;
        const height = parseInt($('#grid-height').val()) || 100;
        addGrid(width, height, 10, 10);
    });

    $('#save-layout').click(function () {
        saveGridLayout();
    });

    function addGrid(width, height, x, y, id = null) {
        const gridId = id || `grid-${gridCounter++}`;
        const grid = $(`<div class="grid" id="${gridId}"></div>`);

        grid.css({
            width: width + 'px',
            height: height + 'px',
            left: x + 'px',
            top: y + 'px'
        });

        // 儲存滑鼠指向時的位置（用於重疊恢復）
        grid.data('hover-left', x);
        grid.data('hover-top', y);
        grid.data('hover-width', width);
        grid.data('hover-height', height);

        gridContainer.append(grid);

        // 確保jQuery UI完全加載後再初始化元素
        setTimeout(function() {
            try {
                if ($.fn.draggable) {
                    grid.draggable({
                        containment: "parent",
                        stop: function (event, ui) {
                            checkGridOverlap(grid);
                        }
                    });
                    console.log(`Grid ${gridId} initialized as draggable`);
                } else {
                    console.error('jQuery UI draggable not available');
                }
            } catch (e) {
                console.error(`Failed to initialize draggable for grid ${gridId}:`, e);
            }

            try {
                if ($.fn.resizable) {
                    grid.resizable({
                        containment: "parent",
                        minWidth: 20,
                        minHeight: 20,
                        handles: "all", // 確保所有拖曳控制把手都存在
                        stop: function (event, ui) {
                            checkGridOverlap(grid);
                        }
                    });
                    console.log(`Grid ${gridId} initialized as resizable`);
                } else {
                    console.error('jQuery UI resizable not available');
                }
            } catch (e) {
                console.error(`Failed to initialize resizable for grid ${gridId}:`, e);
            }
        }, 100); // 小延遲確保DOM完全渲染

        // 滑鼠進入時記錄當前位置
        grid.on('mouseenter', function () {
            const position = $(this).position();
            $(this).data('hover-left', position.left);
            $(this).data('hover-top', position.top);
            $(this).data('hover-width', $(this).width());
            $(this).data('hover-height', $(this).height());
        });

        grid.on('dblclick', function (e) {
            if (confirm('Are you sure you want to delete this grid?')) {
                $(this).remove();
            }
            e.stopPropagation();
        });

        return grid;
    }

    function checkGridOverlap(currentGrid) {
        const current = currentGrid.position();
        const currentRect = {
            left: current.left,
            top: current.top,
            right: current.left + currentGrid.width(),
            bottom: current.top + currentGrid.height()
        };

        let hasOverlap = false;

        $('.grid').not(currentGrid).each(function () {
            const other = $(this).position();
            const otherRect = {
                left: other.left,
                top: other.top,
                right: other.left + $(this).width(),
                bottom: other.top + $(this).height()
            };

            if (
                !(currentRect.right < otherRect.left ||
                  currentRect.left > otherRect.right ||
                  currentRect.bottom < otherRect.top ||
                  currentRect.top > otherRect.bottom)
            ) {
                hasOverlap = true;
                return false;
            }
        });

        if (hasOverlap) {
            currentGrid.css({
                left: currentGrid.data('hover-left') + 'px',
                top: currentGrid.data('hover-top') + 'px',
                width: currentGrid.data('hover-width') + 'px',
                height: currentGrid.data('hover-height') + 'px'
            });
            alert('Grids cannot overlap! Reset to last hover position.');
        }
    }

    function saveGridLayout() {
        const gridLayout = [];

        $('.grid').each(function () {
            const position = $(this).position();
            gridLayout.push({
                id: $(this).attr('id'),
                x: position.left,
                y: position.top,
                width: $(this).width(),
                height: $(this).height()
            });
        });

        $.ajax({
            url: '/Grid/SaveGridLayout',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                grids: JSON.stringify(gridLayout)
            }),
            success: function (response) {
                if (response.status === 'success') {
                    alert('Layout has been saved!');
                }
            },
            error: function (error) {
                console.error('Save Failed:', error);
                alert('Save failed, please check console.');
            }
        });
    }

    function loadGrids() {
        $.ajax({
            url: '/Grid/GetGridLayout',
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                if (response.status === 'success' && response.grids && response.grids.length > 0) {
                    try {
                        const grids = typeof response.grids === 'string' ? 
                            JSON.parse(response.grids) : response.grids;
                        
                        gridContainer.empty();
                        gridCounter = 0;
                        
                        grids.forEach(function (grid) {
                            const newGrid = addGrid(grid.width, grid.height, grid.x, grid.y, grid.id);
                            newGrid.data('hover-left', grid.x);
                            newGrid.data('hover-top', grid.y);
                            newGrid.data('hover-width', grid.width);
                            newGrid.data('hover-height', grid.height);
                        });
                    } catch (e) {
                        console.error('Error parsing grid data:', e);
                    }
                }
            },
            error: function (error) {
                console.error('Load Failed:', error);
                gridContainer.empty();
            }
        });
    }
});