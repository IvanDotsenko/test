<?php
declare(strict_types=1);

namespace IvanDotsenkoTest\Task1\Plugin\Block;

use Magento\Catalog\Block\Category\View;

class CategoryViewPlugin
{
    /**
     * Suppress image, description, and CMS blocks if is_landing_category is enabled
     *
     * @param View $subject
     * @param string $html
     * @return string
     */
    public function afterToHtml(View $subject, string $html): string
    {
        $category = $subject->getCurrentCategory();
        if ($category && $category->getData('is_landing_category')) {
            $blockName = $subject->getNameInLayout();
            if (in_array($blockName, ['category.image', 'category.description', 'category.cms'], true)) {
                return '';
            }
        }
        return $html;
    }
}
