import xlsxwriter

import datetime
import io
import re
import html

gl_col_width = []

class ExcelFile(object):

    def __init__(self, workbook_name, worksheet_name, in_memory=False):
        self.output = io.BytesIO()
        if in_memory:
            self.workbook = xlsxwriter.Workbook(self.output, {'in_memory': True})
        else:
            self.workbook = xlsxwriter.Workbook(workbook_name)
        self.worksheet = self.workbook.add_worksheet(worksheet_name)

        self.col_widths = {}

        self.write_to_row = 0
        self.write_to_col = 0

    def __enter__(self):
        return self

    def close(self):
        self._configure_cols_width()
        self.workbook.close()
        self.output.seek(0)
        return self.output.getvalue()

    def _configure_cols_width(self):
        for k,v in self.col_widths.items():
            self.worksheet.set_column(int(k), int(k), min(v, 100))

    def _configure_no_borders(self):
        self._f_noborders = self.workbook.add_format({'border': 0})

    def _configure_lane_format(self, bg_color):
        self._f_lane = self.workbook.add_format({'bg_color': bg_color})
        self._f_lane_bold = self.workbook.add_format({'bg_color': bg_color, 'bold': True})
        self._f_lane_right = self.workbook.add_format({'bg_color': bg_color, 'align': 'right'})
        self._f_lane_right_bold = self.workbook.add_format({'bg_color': bg_color, 'align': 'right', 'bold': True})

    def _configure_lane_currency_format(self, bg_color):
        self._f_lane_currency = self.workbook.add_format({'bg_color': bg_color, 'num_format': 0x2a, 'border': 1})

    def _configure_lane_percent_format(self, bg_color):
        self._f_lane_percent = self.workbook.add_format({'bg_color': bg_color, 'num_format': 0x0a, 'border': 1})

    def _configure_wrap_format(self):
        self._f_wrap = self.workbook.add_format({'text_wrap': True})

    def _configure_header_format(self, bg_color, color, is_bold=False, alignment="right", valignment="bottom"):
        self._f_header = self.workbook.add_format({'bg_color': bg_color, 'font_color': color, 'font_size': 12,
                                                   'border': 1, 'align': alignment, 'valign': valignment,
                                                   'text_wrap': True})
        if is_bold:
            self._f_header.set_bold()

    def _configure_currency_format(self):
        self._f_currency = self.workbook.add_format({'num_format': 0x03})

    def _configure_percent_format(self):
        self._f_percent = self.workbook.add_format({'num_format': 0x0a})

    def init_report(self):
        self._configure_no_borders()
        self._configure_lane_format('white')
        self._configure_lane_currency_format('white')
        self._configure_lane_percent_format('white')
        self._configure_wrap_format()
        self._configure_header_format('black', 'white', True)
        self._configure_currency_format()
        self._configure_percent_format()

    def _write_cell(self, col, row, text, cell_format=None, is_blank=False):
        if is_blank:
            self.worksheet.write_blank(row, col, None, cell_format)
        elif isinstance(text, int):
            self.worksheet.write_number(row, col, int(text), cell_format)
        elif isinstance(text, float):
            self.worksheet.write_number(row, col, float(text), cell_format)
        else:
            self.worksheet.write_string(row, col, text, cell_format)

    def _write_cell_position(self, position, text, cell_format=None, last_cell=False):
        # global gl_col_width
        # gl_col_width[position] = max(gl_col_width[position], len(str(text)))
        if isinstance(text, int):
            self.worksheet.write_number(self.write_to_row, self.write_to_col, int(text), cell_format)
        elif isinstance(text, float):
            self.worksheet.write_number(self.write_to_row, self.write_to_col, float(text), cell_format)
        else:
            self.worksheet.write_string(self.write_to_row, self.write_to_col, text, cell_format)
        self._reset_cnt(last_cell)

    def _reset_cnt(self, last_cell=False):
        if last_cell:
            self.write_to_row += 1
            self.write_to_col = 0
        else:
            self.write_to_col += 1

    def _write_merged_cell(self, text, merge_count, cell_format=None, last_cell=False):
        self.worksheet.merge_range(self.write_to_row, self.write_to_col, self.write_to_row,
                                    self.write_to_col + merge_count - 1, text, cell_format)
        self._reset_cnt(last_cell)

    def lane_break(self):
        self._write_cell(0, "", None, True)

    def _write_table_header(self, start_row, header_list, header_format):
        global gl_col_width
        gl_col_width = [len(x) for x in header_list]

        for i, elem in enumerate(header_list):
            self._write_cell(i, start_row, elem, header_format)
        start_row += 1
        self._write_cell(0, start_row, "", None, True)
        return start_row

    def write_formula(self, col, row, formula, format=None):
        self.worksheet.write_formula(row, col, formula, format)

    def insert_image(self, position, image):
        self.worksheet.insert_image(position, image)